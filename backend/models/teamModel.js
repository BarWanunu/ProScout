const db = require("../startup/db");

exports.createTeam = async (team) => {
  const {
    user_id,
    team_name,
    league,
    country,
    formation,
    stadium,
    trophies,
    logo,
  } = team;

  try {
    const result = await db.query(
      `INSERT INTO teams 
       (user_id, team_name, league, country, formation, stadium, trophies, logo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id, team_name, created_at`,
      [user_id, team_name, league, country, formation, stadium, trophies, logo]
    );
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to create team: ${err.message}` };
  }
};

exports.findTeamBy = async (field, value) => {
  const allowedFields = ["user_id", "team_name"];
  if (!allowedFields.includes(field)) {
    return { success: false, error: "Invalid field for team lookup" };
  }

  try {
    const query = `SELECT * FROM teams WHERE ${field} = $1`;
    const result = await db.query(query, [value]);
    return { success: true, data: result.rows[0] || null };
  } catch (err) {
    return { success: false, error: `Failed to find team: ${err.message}` };
  }
};

exports.updateTeamField = async (user_id, field, value) => {
  try {
    const query = `UPDATE teams SET ${field} = $1 WHERE user_id = $2 RETURNING *`;
    const result = await db.query(query, [value, user_id]);
    return { success: true, data: result.rows[0] || null };
  } catch (err) {
    return { success: false, error: `Failed to update team: ${err.message}` };
  }
};

exports.deleteTeamByUserId = async (userId) => {
  try {
    const query = "DELETE FROM teams WHERE user_id = $1 RETURNING *";
    const { rows } = await db.query(query, [userId]);
    if (rows.length === 0) return { success: false, error: "Team not found" };
    return { success: true, data: rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to delete team: ${err.message}` };
  }
};
