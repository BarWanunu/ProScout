// src/features/messages/MessagesDemo.jsx
import React, { useEffect, useState } from "react";
import messageService from "@/api/services/messageService";
import { getToken } from "@/api/tokenStore";

export default function MessagesDemo() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // נגדיר את המשתמשים לבדיקה
  const myUserId = 22;      // נניח שאתה מחובר כ־22
  const otherUserId = 759;  // מולו מתכתבים

  const token = getToken();

  // טוען את השיחה
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversation(myUserId, token);
      setMessages(data.messages || []);
      console.log(data);
      
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // שליחת הודעה
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      await messageService.sendMessage(otherUserId, text, token);
      setText("");
      await fetchMessages(); // רענון השיחה
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  // סימון כהודעה נקראה
  const handleMarkAsRead = async (id) => {
    try {
      await messageService.markAsRead(id, token);
      fetchMessages();
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    }
  };

  // מחיקת הודעה
  const handleDelete = async (id) => {
    try {        
      await messageService.deleteMessage(id, token);
      fetchMessages();
    } catch (err) {
      console.error("❌ Failed to delete message:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Messages between {myUserId} & {otherUserId}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet between the users</p>
      ) : ( 
        <ul>
          {messages.map((msg) => (
            <li key={msg.id} style={{ marginBottom: "10px" }}>
              <b>{msg.sender_id === myUserId ? "Me" : "Other"}:</b> {msg.message}
              <br />
              <small>
                {msg.sent_at} | {msg.read ? "✅ Read" : "📩 Unread"}
              </small>
              <div>
                {msg.receiver_id === myUserId && !msg.read && (
                  <button onClick={() => handleMarkAsRead(msg.id)}>
                    Mark as Read
                  </button>
                )}
                {msg.sender_id === myUserId && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          style={{ marginRight: "10px", width: "300px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
