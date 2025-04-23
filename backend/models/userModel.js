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

exports.findUserBy = async (field, value) => {
  const allowedFields = ["id", "email", "username"];

  if (!allowedFields.includes(field)) {
    throw new Error("Invalid field for user lookup");
  }

  const query = `SELECT * FROM users WHERE ${field} = $1`;
  const result = await db.query(query, [value]);
  return result.rows[0];
};

exports.checkPassword = (inputPassword, userPassword) => {
  return inputPassword == userPassword;
};

exports.deleteUserById = async (userId) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING *";
  const { rows } = await db.query(query, [userId]);
  return rows[0];
};
