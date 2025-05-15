const express = require("express");
const router = express.Router();
const trialController = require("../controller/trialController");
const auth = require("../middleware/auth");

router.post("/", auth, trialController.createTrial);
router.patch("/:id", auth, trialController.updateTrialStatus);
router.delete("/:id", auth, trialController.deleteTrial);
router.get("/:id", auth, trialController.getTrialById);
router.get("/:type/:id", auth, trialController.getTrials);

module.exports = router;
