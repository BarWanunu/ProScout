const express = require("express");
const router = express.Router();
const scoutController = require("../controller/scoutController");

router.post("/", scoutController.registerScout);
router.patch("/", scoutController.updateScoutField);

module.exports = router;
