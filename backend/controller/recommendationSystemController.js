require('dotenv').config();

const db = require('../startup/db');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// Endpoint to get all player names for the search bar
exports.getAllPlayersForSearch = async (req, res) => {
  try {
    const result = await db.query('SELECT rk, player FROM proscout_player_stats ORDER BY player ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching player list.', error: error.message });
  }
};

// Helper mapping to convert numeric position code back to label (matches loader mapping)
const POS_CODE_TO_LABEL = {
  1: 'GK',
  2: 'DF',
  3: 'DF,MF',
  4: 'DF,FW',
  5: 'MF,DF',
  6: 'MF',
  7: 'FW,DF',
  8: 'MF,FW',
  9: 'FW,MF',
  10: 'FW',
};

function withReadablePosition(row) {
  if (!row) return row;
  const posCode = row.pos;
  // Clone to avoid mutating original row object from pg
  const cloned = { ...row };
  if (typeof posCode === 'number') {
    cloned.pos = POS_CODE_TO_LABEL[posCode] || String(posCode);
  }
  return cloned;
}

// Features used for similarity in the exact order used by the loader
const SIM_FEATURES = [
  'Pos', 'Age', 'Int', 'Clr', 'KP', 'PPA', 'CrsPA', 'PrgP', 'Playing Time MP',
  'Performance Gls', 'Performance Ast', 'Performance G+A', 'Performance G-PK',
  'Performance Fls', 'Performance Fld', 'Performance Crs', 'Performance Recov',
  'Expected xG', 'Expected npxG', 'Expected xAG', 'Expected xA', 'Expected A-xAG',
  'Expected G-xG', 'Expected np:G-xG', 'Progression PrgC', 'Progression PrgP',
  'Progression PrgR', 'Tackles Tkl', 'Tackles TklW', 'Tackles Def 3rd',
  'Tackles Mid 3rd', 'Tackles Att 3rd', 'Challenges Att', 'Challenges Tkl%',
  'Challenges Lost', 'Blocks Blocks', 'Blocks Sh', 'Blocks Pass', 'Standard Sh',
  'Standard SoT', 'Standard SoT%', 'Standard Sh/90', 'Standard Dist', 'Standard FK',
  'Performance GA', 'Performance SoTA', 'Performance Saves', 'Performance Save%',
  'Performance CS', 'Performance CS%', 'Penalty Kicks PKatt', 'Penalty Kicks Save%',
  'SCA SCA', 'GCA GCA', 'Aerial Duels Won', 'Aerial Duels Lost', 'Aerial Duels Won%',
  'Total Cmp', 'Total Att', 'Total Cmp%', 'Total TotDist', 'Total PrgDist', '1/3'
];

// Subset of features used for the radar chart in the UI
const RADAR_FEATURES = [
  { name: 'Performance Gls', key: 'performance_gls' },
  { name: 'Performance Ast', key: 'performance_ast' },
  { name: 'KP', key: 'kp' },
  { name: 'GCA GCA', key: 'gca_gca' },
  { name: 'Aerial Duels Won', key: 'aerial_duels_won' },
  { name: 'Int', key: 'int' },
  { name: 'Tackles TklW', key: 'tackles_tklw' },
  { name: 'Performance Saves', key: 'performance_saves' },
  { name: 'Performance CS', key: 'performance_cs' },
  { name: 'Performance GA', key: 'performance_ga' },
  { name: 'Performance SoTA', key: 'performance_sota' },
];

function injectRadarScaledMetrics(row) {
  if (!row || !Array.isArray(row.embedding)) return row;
  const out = { ...row };
  RADAR_FEATURES.forEach(({ name, key }) => {
    const idx = SIM_FEATURES.indexOf(name);
    if (idx >= 0 && row.embedding[idx] !== undefined) {
      out[key] = row.embedding[idx]; // already min-max scaled [0,1]
    }
  });
  return out;
}

// Endpoint to find similar players
exports.getSimilarPlayers = async (req, res) => {
  const { playerRk } = req.params;

  try {
    // 1. Fetch the target player and all other players with their embeddings
    const targetPlayerRes = await db.query('SELECT * FROM proscout_player_stats WHERE rk = $1', [playerRk]);
    if (targetPlayerRes.rows.length === 0) {
      return res.status(404).json({ message: 'Player not found.' });
    }
    const targetPlayer = targetPlayerRes.rows[0];

    const allPlayersRes = await db.query('SELECT * FROM proscout_player_stats WHERE rk != $1', [playerRk]);
    const allPlayers = allPlayersRes.rows;

    // 2. Calculate similarity scores
    const similarPlayers = allPlayers.map(player => {
      const similarity = cosineSimilarity(targetPlayer.embedding, player.embedding);
      return { ...player, similarity };
    });

    // 3. Sort by similarity and take the top 10
    const top10 = similarPlayers.sort((a, b) => b.similarity - a.similarity).slice(0, 10);

    // 4. Convert numeric position codes back to readable labels for UI
  const selectedPlayerReadable = injectRadarScaledMetrics(withReadablePosition(targetPlayer));
  const recommendationsReadable = top10.map(p => injectRadarScaledMetrics(withReadablePosition(p)));

    res.json({
      selectedPlayer: selectedPlayerReadable,
      recommendations: recommendationsReadable,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error finding similar players.', error: error.message });
  }
};

// Endpoint to generate the AI scout report
exports.generateScoutReport = async (req, res) => {
  const { selectedPlayer, recommendations, teamRequirements } = req.body;

  // Convert recommendations array to a string format for the prompt
  const recommendationsText = recommendations.map(p => JSON.stringify(p)).join('\n');

  const human_template = `
    Generate a Football Talent Scout report based on the DATA PROVIDED (maximum 250 words) written in a formal tone FOLLOWING THE EXAMPLE.
    It is essential to compare player attributes and select the most suitable candidate from the available options from among similar players, based on the TEAM REQUIREMENTS provided.
    THE PLAYER CHOSEN MUST NECESSARILY BE AMONG THE POSSIBLE PLAYERS CONSIDERED IN THE FOOTBALL SCOUT REPORT.
    INDICATE the player chosen at the end of the REPORT.

    DATA:
    Original Player: ${JSON.stringify(selectedPlayer)}
    Similar Players:
    ------------------------------------
    ${recommendationsText}
    ------------------------------------ 

    TEAM REQUIREMENTS:
    Style of play: ${teamRequirements.style}
    Player type required: ${teamRequirements.experience}
    Preferred league: ${teamRequirements.league}
    Key ability: ${teamRequirements.skills.join(', ')}
    Ideal formation: ${teamRequirements.formation}

    EXAMPLE TO FOLLOW:
    ### Football Scout Report
    After a detailed analysis of the data, we have identified candidates who best meet the requirements of your team. Below, we present three potential candidates:

    **[Player X]**: Highlights strengths and addresses weaknesses based on data on the essential attributes for a player in his specific age group.
    **[Player Y]**: Highlights strengths and addresses weaknesses based on data regarding the attributes a player must necessarily possess in his specific age group.
    **[Player Z]**: Highlighting strengths and addressing weaknesses based on attribute data that a player must necessarily possess in his specific age group.
    
    [Provide the reasons for choosing the recommended player over the others].
    
    The recommended player:
    [INDICATE Name of player recommended].
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a soccer scout and you must be good at finding the best talents for your team from the players provided." },
        { role: "user", content: human_template }
      ],
      temperature: 0.1,
    });

    res.json({ report: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: 'Error generating AI scout report.', error: error.message });
  }
};

// Lightweight player image resolver: constructs a plausible Wikimedia/club search URL (no external deps)
// For production-grade image search, consider integrating a vetted API.
exports.getPlayerImage = async (req, res) => {
  try {
    const { name, squad } = req.query;
    if (!name) return res.status(400).json({ message: 'Missing name' });
    if (typeof fetch !== 'function') {
      const q = encodeURIComponent(`${name} ${squad || ''} football`);
      return res.json({ url: `https://en.wikipedia.org/w/index.php?search=${q}` });
    }
    async function fetchWikiThumb(title) {
      const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
      const r = await fetch(api, { headers: { accept: 'application/json' } });
      if (!r.ok) return null;
      const j = await r.json();
      return j?.thumbnail?.source || null;
    }
    const candidates = [
      `${name} (footballer)`,
      `${name} (association football player)`,
      `${name} (${squad || ''} footballer)`,
      `${name}`,
    ];
    for (const t of candidates) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const url = await fetchWikiThumb(t);
        if (url) return res.json({ url });
      } catch (_) { /* continue */ }
    }
    return res.json({ url: null });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to resolve image', error: error.message });
  }
};