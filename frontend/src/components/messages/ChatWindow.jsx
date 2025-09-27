import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import messageService from '@/api/services/messageService';
import { getToken } from '@/api/tokenStore';
import { getUserImageUrl, getUserInitials } from '@/utils/userImageUtils';
import './styles/Messages.css';

const ChatWindow = ({ selectedConversation, onMessageSent }) => {
  const { id: currentUserId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      // Focus on input when conversation is selected
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }, 200);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to bottom immediately and after a short delay
    scrollToBottom();
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    // Also try to focus after messages load
    if (selectedConversation && messageInputRef.current) {
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }, 100);
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation?.other_user_id) return;

    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      const response = await messageService.getConversation(selectedConversation.other_user_id, token);
      
      console.log('Messages response:', response);
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation?.other_user_id || sending) {
      return;
    }

    try {
      setSending(true);
      setError('');
      
      const token = getToken();
      const response = await messageService.sendMessage(
        selectedConversation.other_user_id,
        newMessage.trim(),
        token
      );

      console.log('Send message response:', response);
      
      // Add the new message to local state
      const sentMessage = {
        id: response.data?.id,
        sender_id: currentUserId,
        receiver_id: selectedConversation.other_user_id,
        message: newMessage.trim(),
        sent_at: new Date().toISOString(),
        read: false,
      };

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Notify parent that a message was sent
      if (onMessageSent) {
        onMessageSent();
      }
      
      // Scroll to bottom after adding new message
      setTimeout(() => {
        scrollToBottom();
      }, 50);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
      // Keep focus on input after sending (whether success or error)
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }, 50);
    }
  };

  const formatMessageTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  const getDisplayName = (conversation) => {
    if (conversation.first_name && conversation.last_name) {
      return `${conversation.first_name} ${conversation.last_name}`;
    }
    return conversation.username || 'Unknown User';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending && newMessage.trim()) {
        handleSendMessage(e);
      }
    }
  };

  if (!selectedConversation) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <div className="empty-icon">
            <MessageSquare size={64} />
          </div>
          <h3>Select a Conversation</h3>
          <p>Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            {getUserImageUrl(selectedConversation) ? (
              <img 
                src={getUserImageUrl(selectedConversation)}
                alt={getDisplayName(selectedConversation)}
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="avatar-initials"
              style={{ display: getUserImageUrl(selectedConversation) ? 'none' : 'flex' }}
            >
              {getUserInitials(selectedConversation)}
            </div>
          </div>
          <div className="chat-user-details">
            <h3>{getDisplayName(selectedConversation)}</h3>
            <p>{selectedConversation.role || 'User'}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            Loading messages...
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <MessageSquare size={48} />
            </div>
            <h3>No Messages Yet</h3>
            <p>Start the conversation by sending the first message!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${
                parseInt(message.sender_id) === parseInt(currentUserId) ? 'sent' : 'received'
              }`}
            >
              <p className="message-content">{message.message}</p>
              <div className="message-time">
                {formatMessageTime(message.sent_at)}
                {parseInt(message.sender_id) === parseInt(currentUserId) && !message.read && (
                  <span> • Sent</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '8px' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="message-input-form">
          <textarea
            ref={messageInputRef}
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={sending}
            autoComplete="off"
            spellCheck="false"
            style={{ 
              height: Math.min(Math.max(48, newMessage.split('\n').length * 24), 120) + 'px'
            }}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
            ) : (
              <>
                <Send size={16} />
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;