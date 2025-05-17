const express = require("express");
const router = express.Router();
const {
  addShortlistedPlayer,
  removeShortlistedPlayer,
  getShortlistedPlayers,
} = require("../controller/shortlistController");
const auth = require("../middleware/auth");

router.post("/", auth, addShortlistedPlayer);
router.delete("/:player_id", auth, removeShortlistedPlayer);
router.get("/", auth, getShortlistedPlayers);

module.exports = router;
