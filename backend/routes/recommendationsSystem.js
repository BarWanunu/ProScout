const express = require("express");
const router = express.Router();
const recommendationsController = require("../controller/recommendationSystemController");
const auth = require("../middleware/auth");

// Route for player search autocomplete
router.get("/players", auth, recommendationsController.getAllPlayersForSearch);

// Route to get similar players for a given player rank (rk)
router.get("/similar/:playerRk", auth, recommendationsController.getSimilarPlayers);

// Route to generate the AI scouting report
router.post("/generate-report", auth, recommendationsController.generateScoutReport);

// Route to fetch a player image URL
router.get("/player-image", auth, recommendationsController.getPlayerImage);

module.exports = router;