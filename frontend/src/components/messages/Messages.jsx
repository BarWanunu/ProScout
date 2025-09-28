import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import messageService from '@/api/services/messageService';
import { getToken } from '@/api/tokenStore';
import './styles/Messages.css';

const Messages = () => {
  const { id: currentUserId } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch conversations on component mount
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [currentUserId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await messageService.getConversations(token);
      if (response.conversations) {
        setConversations(response.conversations);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = getToken();
      const response = await messageService.getUnreadCount(token);
      
      if (response.unread_count !== undefined) {
        setUnreadCount(response.unread_count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);

    // Mark conversation as read if it has unread messages
    if (conversation.unread_count > 0) {
      markConversationAsRead(conversation.other_user_id);
    }
  };

  const markConversationAsRead = async (otherUserId) => {
    try {
      const token = getToken();
      await messageService.markConversationAsRead(otherUserId, token);
      
      // Refresh conversations and unread count
      await fetchConversations();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }
  };

  const handleMessageSent = () => {
    // Refresh conversations when a new message is sent
    fetchConversations();
    fetchUnreadCount();
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="messages-container">
      {/* Header */}
      <div className="messages-header">
        <h2>
          <MessageCircle size={32} />
          Messages
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h2>
        <p>Connect with players, scouts, and teams</p>
      </div>

      {/* Messages Layout */}
      <div className="messages-layout">
        {/* Conversations List - Hidden on mobile when chat is open */}
        <div className={`conversations-panel ${selectedConversation ? 'd-none d-md-block' : ''}`}>
          <ConversationsList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
            loading={loading}
            onRefresh={fetchConversations}
          />
        </div>

        {/* Chat Window */}
        <div className={`chat-panel ${!selectedConversation ? 'd-none d-md-block' : ''}`}>
          <ChatWindow
            conversation={selectedConversation}
            currentUserId={currentUserId}
            onMessageSent={handleMessageSent}
            onBackToConversations={handleBackToConversations}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;