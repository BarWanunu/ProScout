const express = require("express");
const router = express.Router();
const scoutController = require("../controller/scoutController");

router.post("/", scoutController.registerScout);

module.exports = router;
