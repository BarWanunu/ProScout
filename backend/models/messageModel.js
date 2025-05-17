const db = require("../startup/db");

exports.createMessage = async (sender_id, receiver_id, message) => {
  try {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, message, sent_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, sender_id, receiver_id, message, read, sent_at
    `;
    const { rows } = await db.query(query, [sender_id, receiver_id, message]);
    return { success: true, data: rows[0] };
  } catch (err) {
    return {
      success: false,
      error: `Failed to create message: ${err.message}`,
    };
  }
};

exports.getMessagesBetweenUsers = async (user1_id, user2_id) => {
  try {
    const query = `
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY sent_at ASC
    `;
    const { rows } = await db.query(query, [user1_id, user2_id]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: `Failed to get messages: ${err.message}` };
  }
};

exports.markMessageAsRead = async (message_id) => {
  try {
    const query = `
      UPDATE messages
      SET read = TRUE
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [message_id]);
    if (rows.length === 0) {
      return { success: false, error: "Message not found" };
    }
    return { success: true, data: rows[0] };
  } catch (err) {
    return {
      success: false,
      error: `Failed to mark message as read: ${err.message}`,
    };
  }
};

exports.deleteMessage = async (message_id) => {
  try {
    const query = `
      DELETE FROM messages
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [message_id]);
    if (rows.length === 0) {
      return { success: false, error: "Message not found" };
    }
    return { success: true, data: rows[0] };
  } catch (err) {
    return {
      success: false,
      error: `Failed to delete message: ${err.message}`,
    };
  }
};

exports.getMessageById = async (message_id) => {
  try {
    const query = `
      SELECT * FROM messages
      WHERE id = $1
    `;
    const { rows } = await db.query(query, [message_id]);
    if (rows.length === 0) {
      return { success: false, error: "Message not found" };
    }
    return { success: true, data: rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to get message: ${err.message}` };
  }
};
