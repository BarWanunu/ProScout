const db = require("../startup/db");

exports.searchPlayersByName = async (name, limit = 30) => {
  try {
    const query = `
        SELECT * FROM players
      WHERE name ILIKE $1
         OR first_name ILIKE $1
         OR last_name ILIKE $1
      ORDER BY name ASC
      LIMIT $2
        `;
    const { rows } = await db.query(query, [`${name}%`, limit]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: `Database search failed: ${err.message}` };
  }
};

exports.searchTeamsByName = async (name, limit = 30) => {
  try {
    const query = `
        SELECT * FROM teams
      WHERE team_name ILIKE $1
      ORDER BY team_name ASC
      LIMIT $2
        `;
    const { rows } = await db.query(query, [`${name}%`, limit]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: `Database search failed: ${err.message}` };
  }
};
