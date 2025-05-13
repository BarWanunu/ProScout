const express = require("express");
const router = express.Router();
const {
  addShortlistedPlayer,
  removeShortlistedPlayer,
  getShortlistedPlayers,
} = require("../controller/shortlistController");
const auth = require("../middleware/auth");

router.post("/", auth, addShortlistedPlayer);
router.delete("/:team_id/:player_id", auth, removeShortlistedPlayer);
router.get("/:team_id", auth, getShortlistedPlayers);

module.exports = router;
