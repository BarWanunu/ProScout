const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController.js");
const statsController = require("../controller/statsController");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadMedia.js");

router.get("/:id", playerController.getPlayer);
router.post(
  "/",
  auth,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  playerController.registerPlayer
);
//prettier-ignore
router.patch("/", auth,upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  playerController.updatePlayerProfile);
router.delete("/", auth, playerController.deletePlayer);
router.get("/stats/:id", statsController.getPlayerStats);
router.post("/stats/:id/summary", statsController.getPlayerStatsSummary);
router.get("/:id/full", playerController.getPlayerFull);

module.exports = router;
