const express = require("express");
const router = express.Router();
const scoutController = require("../controller/scoutController");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadMedia.js");

router.post("/", auth, upload.single("image"), scoutController.registerScout);
//prettier-ignore
router.patch("/", auth, upload.single("image"), scoutController.updateScoutField);
router.delete("/", auth, scoutController.deleteScout);

module.exports = router;
