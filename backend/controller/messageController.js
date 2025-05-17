const messagesModel = require("../models/messageModel");

exports.createMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id;

  try {
    if (sender_id === receiver_id) {
      //prettier-ignore
      return res.status(400).json({ message: "You cannot send a message to yourself." });
    }

    //prettier-ignore
    const newMessage = await messagesModel.createMessage(sender_id,receiver_id,message);

    if (!newMessage.success) {
      return res.status(500).json({ message: "Failed to send message." });
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while sending the message.", error: err.message });
  }
};

exports.getMessagesBetweenUsers = async (req, res) => {
  const { other_user_id } = req.params;
  const user_id = req.user.id;

  try {
    //prettier-ignore
    const messages = await messagesModel.getMessagesBetweenUsers(user_id,other_user_id);

    if (!messages.success || messages.data.length === 0) {
      return res.status(404).json({
        message: "No messages found between the users.",
      });
    }

    res.status(200).json({
      message: "Messages retrieved successfully.",
      messages: messages.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while retrieving messages.", error: err.message });
  }
};

exports.markMessageAsRead = async (req, res) => {
  const { message_id } = req.params;
  const user_id = req.user.id;

  try {
    const updatedMessage = await messagesModel.markMessageAsRead(message_id);

    if (!updatedMessage.success || !updatedMessage.data) {
      //prettier-ignore
      return res.status(404).json({ message: "Message not found or already marked as read." });
    }

    if (updatedMessage.data.receiver_id !== user_id) {
      return res.status(403).json({
        message: "You are not authorized to mark this message as read.",
      });
    }

    res.status(200).json({
      message: "Message marked as read",
      data: updatedMessage.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while marking message as read.", error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  const { message_id } = req.params;
  const user_id = req.user.id;

  try {
    const message = await messagesModel.getMessageById(message_id);

    if (!message.success) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.data.sender_id !== user_id) {
      return res.status(403).json({
        message: "Forbidden: Only the sender can delete this message",
      });
    }

    const deletedMessage = await messagesModel.deleteMessage(message_id);
    if (!deletedMessage.success) {
      //prettier-ignore
      return res.status(404).json({ message: "Message not found or already deleted." });
    }
    res.status(200).json({
      message: "Message deleted successfully",
      deleted_message: deletedMessage.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while deleting message.", error: err.message });
  }
};
