const db = require("../startup/db");

exports.fetchUserProfile = async (user) => {
  const { id, role } = user;

  let query = "";
  let params = [id];

  switch (role) {
    case "player":
      query = "SELECT * FROM players WHERE user_id = $1";
      break;
    case "scout":
      query = "SELECT * FROM scouts WHERE user_id = $1";
      break;
    case "team":
      query = "SELECT * FROM teams WHERE user_id = $1";
      break;
    default:
      throw new Error("Invalid role");
  }

  const { rows } = await db.query(query, params);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};
