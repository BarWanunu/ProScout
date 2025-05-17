const db = require("../startup/db");

// prettier-ignore
exports.createPlayer = async (player) => {
  const {
    user_id, name, first_name, last_name, age, club, number,
    photo, position, height, weight, nationality, birthdate, video
  } = player;

  try {
    const result = await db.query(
      `INSERT INTO players 
        (user_id, name, first_name, last_name, age, club, number, photo, position, height, weight, nationality, birthdate, video)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id, user_id, name, first_name, last_name, position, club, created_at`,
      [
        user_id, name, first_name, last_name, age, club, number,
        photo, position, height, weight, nationality, birthdate, video
      ]
    );
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to create player: ${err.message}` };
  }
};

exports.findPlayerBy = async (field, value) => {
  const allowedFields = ["user_id", "id"];
  if (!allowedFields.includes(field)) {
    return { success: false, error: "Invalid field for player lookup" };
  }

  try {
    const result = await db.query(`SELECT * FROM players WHERE ${field} = $1`, [
      value,
    ]);
    return { success: true, data: result.rows[0] || null };
  } catch (err) {
    return { success: false, error: `Error finding player: ${err.message}` };
  }
};

exports.updatePlayerProfile = async (user_id, updates) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return { success: false, error: "No fields to update" };
    }

    const setClause = fields
      .map((field, i) => `${field} = $${i + 1}`)
      .join(", ");
    const query = `UPDATE players SET ${setClause} WHERE user_id = $${
      fields.length + 1
    } RETURNING *`;

    const result = await db.query(query, [...values, user_id]);

    if (result.rows.length === 0) {
      return { success: false, error: "Player not found. Update failed." };
    }

    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to update player: ${err.message}` };
  }
};

exports.deletePlayerByUserId = async (userId) => {
  try {
    const query = "DELETE FROM players WHERE user_id = $1 RETURNING *";
    const { rows } = await db.query(query, [userId]);

    if (rows.length === 0) {
      return { success: false, error: "Player not found" };
    }

    return { success: true, data: rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to delete player: ${err.message}` };
  }
};

exports.getPlayerById = async (playerId) => {
  try {
    const query = `SELECT * FROM players WHERE id = $1`;
    const result = await db.query(query, [playerId]);

    return { success: true, data: result.rows[0] || null };
  } catch (err) {
    return {
      success: false,
      error: `Failed to retrieve player: ${err.message}`,
    };
  }
};
