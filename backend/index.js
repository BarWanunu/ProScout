const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/test", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM teams WHERE name = 'Barcelona' "
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error running query", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
