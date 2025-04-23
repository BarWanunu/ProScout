const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require("../middleware/auth");

router.post("/", userController.signupUser);
router.delete("/", auth, userController.deleteUser);

module.exports = router;
