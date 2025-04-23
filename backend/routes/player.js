const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController.js");
const statsController = require("../controller/statsController");
const auth = require("../middleware/auth");

router.post("/", auth, playerController.registerPlayer);
router.patch("/", auth, playerController.updatePlayerProfile);
router.delete("/", auth, playerController.deletePlayer);
router.get("/:id/stats", statsController.getPlayerStats);

module.exports = router;
