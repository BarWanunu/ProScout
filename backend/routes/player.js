const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController.js");
const statsController = require("../controller/statsController");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadMedia.js");

router.get("/:id", playerController.getPlayer);
router.post("/", auth, upload.single("photo"), playerController.registerPlayer);
//prettier-ignore
router.patch("/", auth, upload.single('photo') ,playerController.updatePlayerProfile);
router.delete("/", auth, playerController.deletePlayer);
router.get("/stats/:id", statsController.getPlayerStats);

module.exports = router;
