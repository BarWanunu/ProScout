import React, { useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import { Header, Footer } from '@/layout/overallLayout';
import { useAuth } from '@/auth/AuthContext';
import './styles/Messages.css';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const conversationsRef = useRef(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleSelectConversation = (conversation) => {
    console.log('Selected conversation:', conversation);
    setSelectedConversation(conversation);
  };

  const handleMessageSent = () => {
    // Trigger refresh of conversations when a message is sent
    if (conversationsRef.current && conversationsRef.current.refreshConversations) {
      conversationsRef.current.refreshConversations();
    }
    console.log('Message sent, refreshing conversations');
  };

  const handleUnreadCountChange = (count) => {
    setUnreadCount(count);
  };

  const handleBackToDashboard = () => {
    const dashboardPath = `/${role}-dashboard`;
    navigate(dashboardPath);
  };

  return (
    <>
      <Header />
      <div className="messages-container">
        <Container fluid>
          {/* Messages Header */}
          <div className="messages-header">
            <button 
              className="back-to-dashboard-button"
              onClick={handleBackToDashboard}
              title="Back to Dashboard"
            >
              <ArrowLeft size={24} />
              Back to Dashboard
            </button>
            <h2>
              <MessageSquare size={32} />
              Messages
              {unreadCount > 0 && (
                <span className="unread-badge" style={{ marginLeft: '12px' }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </h2>
            <p>Connect and communicate with players, scouts, and teams</p>
          </div>

          {/* Messages Layout */}
          <div className="messages-layout">
            <ConversationsList 
              ref={conversationsRef}
              onSelectConversation={handleSelectConversation}
              selectedConversation={selectedConversation}
              onUnreadCountChange={handleUnreadCountChange}
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

export default MessagesPage;