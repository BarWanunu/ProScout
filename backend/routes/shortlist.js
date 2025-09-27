const express = require("express");
const router = express.Router();
const {
  addShortlistedPlayer,
  removeShortlistedPlayer,
  getShortlistedPlayers,
  getTeamsByPlayer,
} = require("../controller/shortlistController");
const auth = require("../middleware/auth");

router.post("/", auth, addShortlistedPlayer);
router.delete("/:player_id", auth, removeShortlistedPlayer);
router.get("/", auth, getShortlistedPlayers);
router.get("/my-teams", auth, getTeamsByPlayer); // New route for players

module.exports = router;
