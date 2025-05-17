const db = require("../startup/db");

exports.createUser = async ({ email, username, password, role }) => {
  try {
    const result = await db.query(
      `INSERT INTO users (email, username, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, role, created_at`,
      [email, username, password, role]
    );

    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to create user: ${err.message}` };
  }
};

exports.checkPassword = (inputPassword, userPassword) => {
  return inputPassword == userPassword;
};

exports.findUserBy = async (field, value) => {
  const allowedFields = ["id", "email", "username"];

  if (!allowedFields.includes(field)) {
    return { success: false, error: "Invalid field for user lookup." };
  }

  try {
    const query = `SELECT * FROM users WHERE ${field} = $1`;
    const result = await db.query(query, [value]);
    return { success: true, data: result.rows[0] || null };
  } catch (err) {
    return { success: false, error: `Error finding user: ${err.message}` };
  }
};

exports.deleteUserById = async (userId) => {
  try {
    const query = "DELETE FROM users WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [userId]);

    if (rows.length === 0) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to delete user: ${err.message}` };
  }
};
