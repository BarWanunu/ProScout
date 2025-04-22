const express = require("express");
const router = express.Router();
const scoutController = require("../controller/scoutController");
const auth = require("../middleware/auth");

router.post("/", auth, scoutController.registerScout);
router.patch("/", auth, scoutController.updateScoutField);
router.delete("/", auth, scoutController.deleteScout);

module.exports = router;
