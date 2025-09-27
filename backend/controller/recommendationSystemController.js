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

    // 4. Convert numeric position codes back to readable labels for UI & inject radar metrics
    const selectedPlayerReadable = injectRadarScaledMetrics(withReadablePosition(targetPlayer));
    const recommendationsReadable = top10.map(p => injectRadarScaledMetrics(withReadablePosition(p)));

    // 5. Robust enrichment from players + latest player_stats using fuzzy name matching
    try {
      // Pull ALL players with their latest stats once (allows fuzzy matching like Mbappé vs Mbappe Lottin)
      const allPlayersWithStatsRes = await db.query(`
        SELECT p.id, p.name, p.photo, p.club, p.nationality, p.position, p.number, p.age,
               ps_latest.season as latest_season,
               ps_latest.goals, ps_latest.assists, ps_latest.yellow_cards, ps_latest.red_cards,
               ps_latest.passes_completed, ps_latest.key_passes, ps_latest.shots_on_target,
               ps_latest.dribbles_attempted, ps_latest.dribbles_success, ps_latest.dribble_success_rate,
               ps_latest.tackles, ps_latest.interceptions, ps_latest.duels, ps_latest.duels_won,
               ps_latest.rating
        FROM players p
        LEFT JOIN LATERAL (
          SELECT * FROM player_stats s WHERE s.player_id = p.id ORDER BY season DESC LIMIT 1
        ) ps_latest ON TRUE
      `);
      const allPlayersData = allPlayersWithStatsRes.rows;

      const normalizeName = (str='') => str
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu,'')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g,'')
        .replace(/\s+/g,' ') // collapse spaces
        .trim();

      const tokenize = (str='') => normalizeName(str).split(' ').filter(Boolean);

      const nameScore = (target, candidate) => {
        if (!target || !candidate) return 0;
        const tTokens = tokenize(target);
        const cTokens = tokenize(candidate);
        if (!tTokens.length || !cTokens.length) return 0;
        const setT = new Set(tTokens);
        let intersect = 0; cTokens.forEach(tok => { if (setT.has(tok)) intersect++; });
        const jaccard = intersect / new Set([...tTokens, ...cTokens]).size; // 0..1
        // Prefix match weight
        let prefix = 0;
        if (cTokens[0] && tTokens[0]) {
          const minLen = Math.min(cTokens[0].length, tTokens[0].length);
            let lcp = 0; while (lcp < minLen && cTokens[0][lcp] === tTokens[0][lcp]) lcp++;
          prefix = lcp / Math.max(cTokens[0].length, tTokens[0].length);
        }
        // Last token presence weight (help for compound names like Mbappe Lottin)
        let lastTokenBonus = 0;
        const lastT = tTokens[tTokens.length - 1];
        if (lastT && cTokens.some(ct => ct === lastT)) lastTokenBonus = 0.2;
        return jaccard * 0.55 + prefix * 0.25 + lastTokenBonus; // weighted sum (<=1)
      };

      function normalizeDisplayPosition(pos) {
        if (!pos) return undefined;
        const p = pos.toLowerCase();
        if (p.includes('goal')) return 'Goalkeeper';
        if (p.includes('def')) return 'Defender';
        if (p.includes('mid')) return 'Midfielder';
        if (p.includes('forward') || p.includes('att') || p.includes('striker') || p.includes('fw')) return 'Forward';
        return pos; // fallback raw
      }

      const attach = (row) => {
        if (!row || !row.player) return;
        let best = null; let bestScore = 0;
        for (const cand of allPlayersData) {
          const sc = nameScore(row.player, cand.name);
          if (sc > bestScore) { bestScore = sc; best = cand; }
        }
        // Threshold to avoid random mismatches
        if (best && bestScore >= 0.25) {
          row.photo = best.photo || row.photo;
          row.club = best.club || row.squad || row.club;
            row.nationality = best.nationality || row.nation || row.nationality;
            row.position = normalizeDisplayPosition(best.position) || row.position || row.pos;
            row.number = best.number ?? row.number;
            if (best.age) row.age = best.age;
            row.statsLatest = {
              season: best.latest_season,
              goals: best.goals,
              assists: best.assists,
              yellow_cards: best.yellow_cards,
              red_cards: best.red_cards,
              passes_completed: best.passes_completed,
              key_passes: best.key_passes,
              shots_on_target: best.shots_on_target,
              dribbles_attempted: best.dribbles_attempted,
              dribbles_success: best.dribbles_success,
              dribble_success_rate: best.dribble_success_rate,
              tackles: best.tackles,
              interceptions: best.interceptions,
              duels: best.duels,
              duels_won: best.duels_won,
              rating: best.rating,
            };
        }
      };

      attach(selectedPlayerReadable);
      recommendationsReadable.forEach(attach);
    } catch (enrichErr) {
      console.warn('Fuzzy enrichment failed:', enrichErr.message);
    }

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