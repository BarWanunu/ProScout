const db = require("../startup/db");

exports.createMessage = async ({ sender_id, receiver_id, message }) => {
  const query = `
    INSERT INTO messages (sender_id, receiver_id, message, sent_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id, sender_id, receiver_id, message, read, sent_at
  `;
  const { rows } = await db.query(query, [sender_id, receiver_id, message]);
  return rows[0];
};

exports.getMessagesBetweenUsers = async (user1_id, user2_id) => {
  const query = `
    SELECT * FROM messages
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY sent_at ASC
  `;
  const { rows } = await db.query(query, [user1_id, user2_id]);
  return rows;
};

exports.markMessageAsRead = async (message_id) => {
  const query = `
    UPDATE messages
    SET read = TRUE
    WHERE id = $1
    RETURNING *
  `;
  const { rows } = await db.query(query, [message_id]);
  return rows[0];
};

exports.deleteMessage = async (message_id) => {
  const query = `
    DELETE FROM messages
    WHERE id = $1
    RETURNING *
  `;
  const { rows } = await db.query(query, [message_id]);
  return rows[0];
};

exports.getMessageById = async (message_id) => {
  const query = `
      SELECT * FROM messages
      WHERE id = $1
    `;
  const { rows } = await db.query(query, [message_id]);
  return rows[0];
};
