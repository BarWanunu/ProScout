// Backup of Messages.jsx (this was renamed to MessagesPage.jsx)
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import { Header, Footer } from '@/layout/overallLayout';
import { useAuth } from '@/auth/AuthContext';
import messageService from '@/api/services/messageService';
import { getToken } from '@/api/tokenStore';
import './styles/Messages.css';

const Messages = () => {
  const { id: currentUserId } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      const response = await messageService.getConversations(token);
      
      console.log('Conversations response:', response);
      setConversations(response.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = getToken();
      const response = await messageService.getUnreadCount(token);
      
      console.log('Unread count response:', response);
      setUnreadCount(response.unread_count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleSelectConversation = (conversation) => {
    console.log('Selected conversation:', conversation);
    setSelectedConversation(conversation);
  };

  const handleMessageSent = () => {
    // Refresh conversations and unread count when a message is sent
    fetchConversations();
    fetchUnreadCount();
    console.log('Message sent, refreshing data');
  };

  return (
    <>
      <Header />
      <div className="messages-container">
        <Container fluid>
          {/* Messages Header */}
          <div className="messages-header">
            <h2>
              📧 Messages
              {unreadCount > 0 && (
                <span className="unread-badge" style={{ marginLeft: '12px' }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </h2>
            <p>Connect and communicate with players, scouts, and teams</p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              color: '#ef4444', 
              padding: '16px', 
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Messages Layout */}
          <div className="messages-layout">
            <ConversationsList 
              conversations={conversations}
              loading={loading}
              onSelectConversation={handleSelectConversation}
              selectedConversation={selectedConversation}
            />
            <ChatWindow 
              selectedConversation={selectedConversation}
              onMessageSent={handleMessageSent}
            />
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Messages;