const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");

router.get("/players", searchController.searchPlayersByName);

module.exports = router;
