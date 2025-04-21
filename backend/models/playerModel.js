const db = require("../startup/db");

// prettier-ignore
exports.createPlayer = async (player) => {
  const {
    username, name, first_name, last_name, age, club, number,
    photo, position, height, weight, nationality, birthdate, video
  } = player;

  // prettier-ignore
  const result = await db.query(
    `INSERT INTO players 
      (user_id, name, first_name, last_name, age, club, number, photo, position, height, weight, nationality, birthdate, video)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING id, user_id, name, first_name, last_name, position, club, created_at`,
    [
        username, name, first_name, last_name, age, club, number,
        photo, position, height, weight, nationality, birthdate, video
    ]
  );

  return result.rows[0];
};

exports.findPlayerByUserId = async (user_id) => {
  const result = await db.query("SELECT * FROM players WHERE user_id = $1", [
    user_id,
  ]);
  return result.rows[0];
};
