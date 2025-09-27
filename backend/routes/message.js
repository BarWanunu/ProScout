const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessagesBetweenUsers,
  markMessageAsRead,
  deleteMessage,
  getUserConversations,
  getUnreadMessageCount,
  markConversationAsRead,
} = require("../controller/messageController");
const auth = require("../middleware/auth");

// Conversation operations (must be before specific routes)
router.get("/conversations/list", auth, getUserConversations);
router.get("/unread/count", auth, getUnreadMessageCount);
router.patch(
  "/conversations/:other_user_id/read",
  auth,
  markConversationAsRead
);

// Message operations
router.post("/", auth, createMessage);
router.get("/:other_user_id", auth, getMessagesBetweenUsers);
router.patch("/:message_id", auth, markMessageAsRead);
router.delete("/:message_id", auth, deleteMessage);

module.exports = router;
