const db = require("../startup/db");

exports.addShortlistedPlayer = async (team_id, player_id) => {
  try {
    const query = `
      INSERT INTO shortlisted_players (team_id, player_id, shortlisted_at)
      VALUES($1, $2, NOW())
      ON CONFLICT (team_id, player_id) DO NOTHING
      RETURNING team_id, player_id, shortlisted_at
    `;
    const { rows } = await db.query(query, [team_id, player_id]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

exports.removeShortlistedPlayer = async (team_id, player_id) => {
  try {
    const query = `
      DELETE FROM shortlisted_players
      WHERE team_id = $1 AND player_id = $2
      RETURNING team_id, player_id
    `;
    const { rows } = await db.query(query, [team_id, player_id]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

exports.getShortlistedPlayers = async (team_id) => {
  try {
    const query = `
      SELECT sp.team_id, sp.player_id, p.name, p.position, p.club
      FROM shortlisted_players sp
      JOIN players p ON sp.player_id = p.id
      WHERE sp.team_id = $1
    `;
    const { rows } = await db.query(query, [team_id]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

exports.isPlayerShortlisted = async (team_id, player_id) => {
  try {
    const query = `
      SELECT 1 FROM shortlisted_players
      WHERE team_id = $1 AND player_id = $2
    `;
    const { rows } = await db.query(query, [team_id, player_id]);
    return { success: true, data: rows.length > 0 };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get teams that have shortlisted a specific player
exports.getTeamsByPlayer = async (player_id) => {
  try {
    const query = `
      SELECT sp.team_id, sp.shortlisted_at, t.team_name, t.league, t.country, t.formation
      FROM shortlisted_players sp
      JOIN teams t ON sp.team_id = t.id
      WHERE sp.player_id = $1
      ORDER BY sp.shortlisted_at DESC
    `;
    const { rows } = await db.query(query, [player_id]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
