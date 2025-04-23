const db = require("../startup/db");
const presetStats = require("../utils/presetStats");

exports.insertRandomStatsForPlayer = async (player, season = 2024) => {
  const { id: player_id, name, club, position } = player;
  const statsOptions = presetStats[position];

  if (!statsOptions || statsOptions.length === 0) {
    throw new Error(`No preset stats found for position: ${position}`);
  }

  const randomStats =
    statsOptions[Math.floor(Math.random() * statsOptions.length)];

  //prettier-ignore
  const columns = ["player_id", "name", "season", "club",
    ...Object.keys(randomStats)
  ]
  //prettier-ignore
  const values = [player_id, name, season, club,
    ...Object.values(randomStats)
  ]

  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO player_stats (${columns.join(", ")})
  VALUES(${placeholders}) RETURNING *`;

  const result = await db.query(query, values);
  return result.rows[0];
};

exports.getStatsByPlayerId = async (playerId) => {
  const query = `SELECT * FROM player_stats
    WHERE player_id = $1`;

  const result = await db.query(query, [playerId]);
  return result.rows;
};
