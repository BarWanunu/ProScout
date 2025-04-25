const db = require("../startup/db");

// prettier-ignore
exports.createPlayer = async (player) => {
  const {
    user_id, name, first_name, last_name, age, club, number,
    photo, position, height, weight, nationality, birthdate, video
  } = player;

  // prettier-ignore
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

  return result.rows[0];
};

exports.findPlayerBy = async (field, value) => {
  const allowedFields = ["user_id"];
  if (!allowedFields.includes(field)) {
    throw new Error("Invalid field for player lookup");
  }

  const result = await db.query(`SELECT * FROM players WHERE ${field} = $1`, [
    value,
  ]);
  return result.rows[0];
};

exports.updatePlayerProfile = async (user_id, updates) => {
  const { username, ...filterUpdates } = updates;
  const fields = Object.keys(filterUpdates);
  const values = Object.values(filterUpdates);

  if (fields.length === 0) return null;

  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");
  const query = `UPDATE players SET ${setClause} WHERE user_id = $${
    fields.length + 1
  } RETURNING *`;

  const result = await db.query(query, [...values, user_id]);
  return result.rows[0];
};

exports.deletePlayerByUserId = async (userId) => {
  const query = "DELETE FROM players WHERE user_id = $1 RETURNING *";
  const { rows } = await db.query(query, [userId]);
  return rows[0];
};

exports.getPlayerById = async (playerId) => {
  const query = `SELECT * FROM players
    WHERE id = $1`;

  const result = await db.query(query, [playerId]);
  return result.rows;
};
