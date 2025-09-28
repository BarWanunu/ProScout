import { http } from "../http";

const endpoint = "/message";

async function sendMessage(receiverId, message, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const body = { receiver_id: receiverId, message };
  const response = await http.post(endpoint, body, config);
  return response.data;
}

async function getConversation(otherUserId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.get(`${endpoint}/${otherUserId}`, config);
  return response.data;
}

// Get all conversations for current user
async function getConversations(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.get(`${endpoint}/conversations/list`, config);
  return response.data;
}

// Get unread message count
async function getUnreadCount(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.get(`${endpoint}/unread/count`, config);
  return response.data;
}

async function markAsRead(messageId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.patch(`${endpoint}/${messageId}`, {}, config);
  return response.data;
}

// Mark entire conversation as read
async function markConversationAsRead(otherUserId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.patch(
    `${endpoint}/conversations/${otherUserId}/read`,
    {},
    config
  );
  return response.data;
}

async function deleteMessage(messageId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.delete(`${endpoint}/${messageId}`, config);
  return response.data;
}

const messageService = {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
  markAsRead,
  markConversationAsRead,
  deleteMessage,
};

export default messageService;
