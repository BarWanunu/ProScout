const db = require("../startup/db");

exports.createScout = async (scout) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      phone,
      nationality,
      experience_years,
      image,
    } = scout;

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

    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to create scout: ${err.message}` };
  }
};

exports.findScoutBy = async (field, value) => {
  try {
    const allowedFields = ["user_id", "phone", "id"];
    if (!allowedFields.includes(field)) {
      return { success: false, error: "Invalid field for scout lookup" };
    }

    const query = `SELECT * FROM scouts WHERE ${field} = $1`;
    const result = await db.query(query, [value]);

    if (result.rows.length === 0) {
      return { success: false, error: "Scout not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Error finding scout: ${err.message}` };
  }
};

exports.updateScoutField = async (user_id, field, value) => {
  try {
    const allowedFields = ["image", "experience_years"];
    if (!allowedFields.includes(field)) {
      return { success: false, error: "Field not allowed to be updated" };
    }

    const query = `UPDATE scouts SET ${field} = $1 WHERE user_id = $2 RETURNING *`;
    const result = await db.query(query, [value, user_id]);

    if (result.rows.length === 0) {
      return { success: false, error: "Scout profile not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to update scout: ${err.message}` };
  }
};

exports.deleteScoutByUserId = async (userId) => {
  try {
    const query = "DELETE FROM scouts WHERE user_id = $1 RETURNING *";
    const { rows } = await db.query(query, [userId]);
    if (rows.length === 0) {
      return { success: false, error: "Scout profile not found" };
    }
    return { success: true, data: rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to delete scout: ${err.message}` };
  }
};
