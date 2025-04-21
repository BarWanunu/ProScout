const db = require("../startup/db");

exports.createScout = async (scout) => {
  // prettier-ignore
  const {user_id, first_name, last_name, phone, nationality, experience_years, image,} = scout;

  const result = await db.query(
    `INSERT INTO scouts 
        (user_id, first_name, last_name, phone, nationality, experience_years, image)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, user_id, first_name, last_name, phone, nationality, experience_years, image, created_at`,
    [
      user_id,
      first_name,
      last_name,
      phone,
      nationality,
      experience_years,
      image,
    ]
  );

  return result.rows[0];
};

exports.findScoutBy = async (field, value) => {
  const allowedFields = ["user_id", "phone"];

  if (!allowedFields.includes(field)) {
    throw new Error("Invalid field for user lookup");
  }

  const query = `SELECT * FROM scouts WHERE ${field} = $1`;
  const result = await db.query(query, [value]);
  return result.rows[0];
};

exports.updateScoutField = async (user_id, field, value) => {
  const allowedFields = ["image", "experience_years"];
  if (!allowedFields.includes(field)) {
    throw new Error("Field not allowed to be updated");
  }

  const query = `UPDATE scouts set ${field} = $1 WHERE user_id = $2 RETURNING *`;
  const result = await db.query(query, [value, user_id]);
  return result.rows[0];
};
