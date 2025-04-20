const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController.js");

router.post("/", playerController.registerPlayer);

module.exports = router;
