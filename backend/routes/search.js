const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");

router.get("/players", searchController.searchPlayersByName);
router.get("/teams", searchController.searchTeamsByName);

module.exports = router;
