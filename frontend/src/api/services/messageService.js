import { http } from "../http";

const endpoint = "/message";

async function sendMessage(receieverId, message, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const body = { receiver_id: receieverId, message };
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

async function markAsRead(messageId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.patch(`${endpoint}/${messageId}`, {}, config);
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
  markAsRead,
  deleteMessage,
};

export default messageService;
