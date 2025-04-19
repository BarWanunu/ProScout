const express = require("express");
const router = express.Router();
const teamController = require("../controller/teamController");

router.post("/", teamController.registerTeam);

module.exports = router;
