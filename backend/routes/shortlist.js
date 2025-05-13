const express = require("express");
const router = express.Router();
const {
  addShortlistedPlayer,
  removeShortlistedPlayer,
  getShortlistedPlayers,
} = require("../controllers/shortlistController");
const auth = require("../middleware/auth");

router.post("/shortlist", auth, addShortlistedPlayer);
router.delete("/shortlist/:team_id/:player_id", auth, removeShortlistedPlayer);
router.get("/shortlist/:team_id", auth, getShortlistedPlayers);

module.exports = router;
