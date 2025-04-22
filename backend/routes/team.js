const express = require("express");
const router = express.Router();
const teamController = require("../controller/teamController");

router.post("/", teamController.registerTeam);
router.patch("/", teamController.updateTeamField);

module.exports = router;
