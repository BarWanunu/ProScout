const db = require("../startup/db");

exports.createMessage = async (sender_id, receiver_id, message) => {
  console.log("=== messageModel.createMessage ===");
  console.log(
    `Parameters: sender_id=${sender_id}, receiver_id=${receiver_id}, message="${message}"`
  );

  try {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, message, sent_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, sender_id, receiver_id, message, read, sent_at
    `;

    console.log("Executing query:", query);
    console.log("Query parameters:", [sender_id, receiver_id, message]);

    const { rows } = await db.query(query, [sender_id, receiver_id, message]);

    console.log("Query result rows:", rows);

    return { success: true, data: rows[0] };
  } catch (err) {
    console.error("Database error in createMessage:", err);
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

// Get all messages where user is involved (either sender or receiver)
exports.getUserMessages = async (user_id) => {
  try {
    const query = `
      SELECT m.*, 
             sender.username as sender_username, sender.role as sender_role,
             receiver.username as receiver_username, receiver.role as receiver_role
      FROM messages m
      LEFT JOIN users sender ON m.sender_id = sender.id
      LEFT JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY m.sent_at DESC
    `;
    const { rows } = await db.query(query, [user_id]);
    return { success: true, data: rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to get user messages: ${err.message}`,
    };
  }
};

// Keep the old function for backward compatibility but simplified
exports.getUserConversations = async (user_id) => {
  try {
    const query = `
      SELECT DISTINCT
        CASE 
          WHEN sender_id = $1 THEN receiver_id 
          ELSE sender_id 
        END AS other_user_id,
        u.username,
        u.role,
        p.photo,
        s.image,
        t.logo
      FROM messages m
      JOIN users u ON u.id = CASE 
        WHEN m.sender_id = $1 THEN m.receiver_id 
        ELSE m.sender_id 
      END
      LEFT JOIN players p ON u.id = p.user_id AND u.role = 'player'
      LEFT JOIN scouts s ON u.id = s.user_id AND u.role = 'scout'
      LEFT JOIN teams t ON u.id = t.user_id AND u.role = 'team'
      WHERE sender_id = $1 OR receiver_id = $1
      ORDER BY u.username
    `;
    const { rows } = await db.query(query, [user_id]);
    return { success: true, data: rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to get conversations: ${err.message}`,
    };
  }
};

// Get unread message count for a user
exports.getUnreadMessageCount = async (user_id) => {
  try {
    const query = `
      SELECT COUNT(*) AS unread_count
      FROM messages
      WHERE receiver_id = $1 AND read = FALSE
    `;
    const { rows } = await db.query(query, [user_id]);
    return { success: true, data: parseInt(rows[0].unread_count) };
  } catch (err) {
    return {
      success: false,
      error: `Failed to get unread count: ${err.message}`,
    };
  }
};

// Mark all messages in a conversation as read
exports.markConversationAsRead = async (user_id, other_user_id) => {
  try {
    const query = `
      UPDATE messages
      SET read = TRUE
      WHERE receiver_id = $1 AND sender_id = $2 AND read = FALSE
      RETURNING id
    `;
    const { rows } = await db.query(query, [user_id, other_user_id]);
    return { success: true, data: { marked_count: rows.length } };
  } catch (err) {
    return {
      success: false,
      error: `Failed to mark conversation as read: ${err.message}`,
    };
  }
};
