const db = require("../startup/db");

exports.createUser = async ({ email, username, password, role }) => {
  const result = await db.query(
    `INSERT INTO users (email, username, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, role, created_at`,
    [email, username, password, role]
  );

  return result.rows[0];
};

exports.findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users where email = $1", [
    email,
  ]);
  return result.rows[0];
};

exports.findUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

exports.checkPassword = (inputPassword, userPassword) => {
  return inputPassword == userPassword;
};
