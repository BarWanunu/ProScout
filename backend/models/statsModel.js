const db = require("../startup/db");
const presetStats = require("../utils/presetStats");

exports.insertRandomStatsForPlayer = async (player, season = 2024) => {
  try {
    const { id: player_id, name, club, position } = player;
    const statsOptions = presetStats[position];

    if (!statsOptions) {
      return {
        success: false,
        error: `No preset stats found for position: ${position}`,
      };
    }

    //prettier-ignore
    const randomStats = statsOptions[Math.floor(Math.random() * statsOptions.length)];
    //prettier-ignore
    const columns = ["player_id", "name", "season", "club", ...Object.keys(randomStats)];
    //prettier-ignore
    const values = [player_id, name, season, club, ...Object.values(randomStats)];

    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO player_stats (${columns.join(
      ", "
    )}) VALUES(${placeholders}) RETURNING *`;

    const result = await db.query(query, values);
    return { success: true, data: result.rows[0] };
  } catch (err) {
    //prettier-ignore
    return { success: false, error: `Failed to create player stats: ${err.message}` };
  }
};

exports.getStatsByPlayerId = async (playerId) => {
  try {
    const query = `SELECT * FROM player_stats WHERE player_id = $1`;
    const result = await db.query(query, [playerId]);

    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to retrieve player stats: ${err.message}`,
    };
  }
};

exports.getPlayerStatsSummary = async (playerId, fromYear, toYear) => {
  try {
    let query = `
      SELECT
        player_id,
        SUM(goals) AS total_goals,
        SUM(assists) AS total_assists,
        SUM(yellow_cards) AS total_yellow_cards,
        SUM(red_cards) AS total_red_cards,
        SUM(passes_completed) AS total_passes_completed,
        SUM(key_passes) AS total_key_passes,
        SUM(dribbles_attempted) AS total_dribbles_attempted,
        SUM(dribbles_success) AS total_dribbles_successful,
        SUM(tackles) AS total_tackles,
        SUM(interceptions) AS total_interceptions,
        SUM(duels) AS total_duels,
        SUM(duels_won) AS total_duels_won,
        ROUND(AVG(rating), 2) AS average_rating,
        COUNT(*) AS seasons_counted
      FROM player_stats
      WHERE player_id = $1  
    `;

    const values = [playerId];
    let paramIndex = 2;

    if (fromYear) {
      query += ` AND season >= $${paramIndex}`;
      values.push(fromYear);
      paramIndex++;
    }

    if (toYear) {
      query += ` AND season <= $${paramIndex}`;
      values.push(toYear);
    }

    query += ` GROUP BY player_id`;

    const result = await db.query(query, values);
    if (result.rows.length === 0)
      return { success: false, message: "No stats found." };

    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
