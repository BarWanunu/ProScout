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
