const db = require("../startup/db");

exports.findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users where email = $1", [
    email,
  ]);
  return result.rows[0];
};

exports.checkPassword = (inputPassword, userPassword) => {
  return inputPassword == userPassword;
};
