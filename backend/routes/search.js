const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");

router.get("/players", searchController.searchPlayersByName);
router.post("/players/advanced", searchController.advancedSearchPlayers);
router.post("/players/stats", searchController.searchPlayersWithStats);
router.get("/teams", searchController.searchTeamsByName);
router.post("/teams/advanced", searchController.advancedSearchTeams);
router.get("/scouts", searchController.searchScoutsByName);

module.exports = router;
