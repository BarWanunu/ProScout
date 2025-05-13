const jwt = require("jsonwebtoken");
const db = require("../startup/db");

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decoded.role) {
      const result = await db.query("SELECT role FROM users WHERE id = $1", [
        decoded.id,
      ]);
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }
      decoded.role = result.rows[0].role;
    }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};
