const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessagesBetweenUsers,
  markMessageAsRead,
  deleteMessage,
} = require("../controller/messageController");
const auth = require("../middleware/auth");

router.post("/", auth, createMessage);
router.get("/:other_user_id", auth, getMessagesBetweenUsers);
router.patch("/:message_id", auth, markMessageAsRead);
router.delete("/:message_id", auth, deleteMessage);

module.exports = router;
