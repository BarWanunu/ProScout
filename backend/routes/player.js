const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController.js");

router.post("/", playerController.registerPlayer);
router.patch("/", playerController.updatePlayerProfile);

module.exports = router;
