const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController.js");
const auth = require("../middleware/auth");

router.post("/", auth, playerController.registerPlayer);
router.patch("/", auth, playerController.updatePlayerProfile);
router.delete("/", auth, playerController.deletePlayer);

module.exports = router;
