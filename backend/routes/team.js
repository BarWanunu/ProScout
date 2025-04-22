const express = require("express");
const router = express.Router();
const teamController = require("../controller/teamController");
const auth = require("../middleware/auth");

router.post("/", auth, teamController.registerTeam);
router.patch("/", auth, teamController.updateTeamField);

module.exports = router;
