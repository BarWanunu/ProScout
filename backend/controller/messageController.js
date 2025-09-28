const messagesModel = require("../models/messageModel");

exports.createMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id;

  try {
    // Validate input
    if (!receiver_id || !message || message.trim().length === 0) {
      return res.status(400).json({
        message: "Receiver ID and message content are required.",
      });
    }

    if (sender_id === receiver_id) {
      return res
        .status(400)
        .json({ message: "You cannot send a message to yourself." });
    }

    const newMessage = await messagesModel.createMessage(
      sender_id,
      receiver_id,
      message.trim()
    );

    if (!newMessage.success) {
      return res.status(500).json({ message: "Failed to send message." });
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage.data,
    });
  } catch (err) {
    console.error("Error in createMessage:", err);
    res.status(500).json({
      message: "Internal server error while sending the message.",
      error: err.message,
    });
  }
};

exports.getMessagesBetweenUsers = async (req, res) => {
  const { other_user_id } = req.params;
  const user_id = req.user.id;

  try {
    if (!other_user_id) {
      return res.status(400).json({ message: "Other user ID is required." });
    }

    const messages = await messagesModel.getMessagesBetweenUsers(
      user_id,
      parseInt(other_user_id)
    );

    if (!messages.success) {
      return res.status(500).json({
        message: "Failed to retrieve messages",
        error: messages.error,
      });
    }

    res.status(200).json({
      message: "Messages retrieved successfully",
      messages: messages.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error while retrieving messages.",
      error: err.message,
    });
  }
};

exports.markMessageAsRead = async (req, res) => {
  const { message_id } = req.params;

  try {
    const message = await messagesModel.getMessageById(message_id);
    if (!message.success) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.data.receiver_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only mark your own messages as read." });
    }

    const updatedMessage = await messagesModel.markMessageAsRead(message_id);

    if (!updatedMessage.success) {
      return res
        .status(500)
        .json({ message: "Failed to mark message as read." });
    }

    res.status(200).json({
      message: "Message marked as read",
      data: updatedMessage.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error while marking message as read.",
      error: err.message,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  const { message_id } = req.params;

  try {
    const message = await messagesModel.getMessageById(message_id);
    if (!message.success) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.data.sender_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages." });
    }

    const deletedMessage = await messagesModel.deleteMessage(message_id);

    if (!deletedMessage.success) {
      return res.status(500).json({ message: "Failed to delete message." });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      data: deletedMessage.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error while deleting message.",
      error: err.message,
    });
  }
};

// Get all conversations for the current user
exports.getUserConversations = async (req, res) => {
  const user_id = req.user.id;

  try {
    const conversations = await messagesModel.getUserConversations(user_id);

    if (!conversations.success) {
      return res.status(500).json({
        message: "Failed to get conversations",
        error: conversations.error,
      });
    }

    res.status(200).json({
      message: "Conversations retrieved successfully",
      conversations: conversations.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error while retrieving conversations",
      error: err.message,
    });
  }
};

// Get unread message count for the current user
exports.getUnreadMessageCount = async (req, res) => {
  const user_id = req.user.id;

  try {
    const unreadCount = await messagesModel.getUnreadMessageCount(user_id);

    if (!unreadCount.success) {
      return res.status(500).json({
        message: "Failed to get unread count",
        error: unreadCount.error,
      });
    }

    res.status(200).json({
      message: "Unread count retrieved successfully",
      unread_count: unreadCount.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error while retrieving unread count",
      error: err.message,
    });
  }
};

// Mark all messages in a conversation as read
exports.markConversationAsRead = async (req, res) => {
  const { other_user_id } = req.params;
  const user_id = req.user.id;

  try {
    if (!other_user_id) {
      return res.status(400).json({ message: "Other user ID is required." });
    }

    const result = await messagesModel.markConversationAsRead(
      user_id,
      parseInt(other_user_id)
    );

    if (!result.success) {
      return res.status(500).json({
        message: "Failed to mark conversation as read",
        error: result.error,
      });
    }

    res.status(200).json({
      message: "Conversation marked as read successfully",
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error while marking conversation as read",
      error: err.message,
    });
  }
};
