const messagesModel = require("../models/messageModel");

exports.createMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id;

  try {
    if (sender_id === receiver_id) {
      return res
        .status(400)
        .json({ message: "You cannot send a message to yourself." });
    }

    const newMessage = await messagesModel.createMessage({
      sender_id,
      receiver_id,
      message,
    });
    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMessagesBetweenUsers = async (req, res) => {
  const { other_user_id } = req.params;
  const user_id = req.user.id;

  try {
    const messages = await messagesModel.getMessagesBetweenUsers(
      user_id,
      other_user_id
    );
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.markMessageAsRead = async (req, res) => {
  const { message_id } = req.params;

  try {
    const updatedMessage = await messagesModel.markMessageAsRead(message_id);
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res
      .status(200)
      .json({ message: "Message marked as read", data: updatedMessage });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  const { message_id } = req.params;
  const user_id = req.user.id;

  try {
    const message = await messagesModel.getMessageById(message_id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.sender_id !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: Only the sender can delete this message",
      });
    }

    const deletedMessage = await messagesModel.deleteMessage(message_id);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
