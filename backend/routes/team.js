const express = require("express");
const router = express.Router();
const teamController = require("../controller/teamController");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadMedia.js");

router.post("/", auth, upload.single("logo"), teamController.registerTeam);
router.patch("/", auth, upload.single("logo"), teamController.updateTeamField);
router.delete("/", auth, teamController.deleteTeam);
router.get("/:id", teamController.getTeam);

module.exports = router;
