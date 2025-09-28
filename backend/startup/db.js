const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Create uploads directories
const uploadsDir = path.join(__dirname, "..", "uploads");
const teamsDir = path.join(uploadsDir, "teams");
const playersDir = path.join(uploadsDir, "players");
const scoutsDir = path.join(uploadsDir, "scouts");

[uploadsDir, teamsDir, playersDir, scoutsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("Connected to db"))
  .catch((err) => console.error("Connection to DB failed", err));

module.exports = pool;
