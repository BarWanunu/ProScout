import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Users, MessageCircle, Clock } from 'lucide-react';
import messageService from '@/api/services/messageService';
import { getToken } from '@/api/tokenStore';
import { getUserImageUrl, getUserInitials } from '@/utils/userImageUtils';
import { useAuth } from '@/auth/AuthContext';
import './styles/Messages.css';

const ConversationsList = forwardRef(({ onSelectConversation, selectedConversation, onUnreadCountChange }, ref) => {
  const { id: currentUserId } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Expose fetchConversations method to parent
  useImperativeHandle(ref, () => ({
    refreshConversations: fetchConversations
  }));

  useEffect(() => {
    fetchConversations();
    // Set up polling to refresh conversations every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      const response = await messageService.getConversations(token);
      
      console.log('Conversations response:', response);
      
      // Process conversations with additional data
      const conversationsWithDetails = await Promise.all(
        (response.conversations || []).map(async (conv) => {
          try {
            // Get messages between current user and this user
            const messagesResponse = await messageService.getConversation(conv.other_user_id, token);
            const messages = messagesResponse.messages || [];
            
            // Get last message
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            
            // Count unread messages from this user
            const unreadCount = messages.filter(msg => {
              const isForCurrentUser = parseInt(msg.receiver_id) === parseInt(currentUserId);
              const isUnread = !msg.read;
              console.log(`Message ${msg.id}: receiver_id=${msg.receiver_id}, currentUserId=${currentUserId}, isForCurrentUser=${isForCurrentUser}, read=${msg.read}, isUnread=${isUnread}`);
              return isForCurrentUser && isUnread;
            }).length;
            
            console.log(`User ${conv.other_user_id}: total messages=${messages.length}, unread count=${unreadCount}`);
            
            return {
              ...conv,
              last_message: lastMessage?.message || null,
              last_message_time: lastMessage?.sent_at || null,
              last_sender_id: lastMessage?.sender_id || null,
              unread_count: unreadCount
            };
          } catch (err) {
            console.error(`Error processing conversation ${conv.other_user_id}:`, err);
            return {
              ...conv,
              last_message: null,
              last_message_time: null,
              last_sender_id: null,
              unread_count: 0
            };
          }
        })
      );
      
      // Sort by last message time (most recent first)
      conversationsWithDetails.sort((a, b) => {
        if (!a.last_message_time) return 1;
        if (!b.last_message_time) return -1;
        return new Date(b.last_message_time) - new Date(a.last_message_time);
      });
      
      setConversations(conversationsWithDetails);
      
      // Calculate total unread count and notify parent
      const totalUnread = conversationsWithDetails.reduce((sum, conv) => sum + conv.unread_count, 0);
      if (onUnreadCountChange) {
        onUnreadCountChange(totalUnread);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d`;
      
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
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

  const handleConversationClick = async (conversation) => {
    // Mark conversation as read when selected
    if (conversation.unread_count > 0) {
      await markConversationAsRead(conversation.other_user_id);
    }
    onSelectConversation(conversation);
  };

  const markConversationAsRead = async (otherUserId) => {
    try {
      console.log(`Marking conversation with user ${otherUserId} as read`);
      const token = getToken();
      const result = await messageService.markConversationAsRead(otherUserId, token);
      console.log('Mark as read result:', result);
      
      // Update local state immediately
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.other_user_id === otherUserId 
            ? { ...conv, unread_count: 0 }
            : conv
        );
        
        // Update total unread count
        const totalUnread = updated.reduce((sum, conv) => sum + conv.unread_count, 0);
        console.log(`Updated total unread count: ${totalUnread}`);
        if (onUnreadCountChange) {
          onUnreadCountChange(totalUnread);
        }
        
        return updated;
      });
      
    } catch (err) {
      console.error('Failed to mark conversation as read:', err);
      // Refresh conversations to get updated state
      fetchConversations();
    }
  };

  if (loading) {
    return (
      <div className="conversations-list">
        <div className="conversations-header">
          <h3>
            <MessageCircle size={20} />
            Conversations
          </h3>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading conversations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversations-list">
        <div className="conversations-header">
          <h3>
            <MessageCircle size={20} />
            Conversations
          </h3>
        </div>
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversations-list">
      <div className="conversations-header">
        <h3>
          <MessageCircle size={20} />
          Conversations ({conversations.length})
        </h3>
      </div>
      
      <div className="conversations-scroll">
        {conversations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={48} />
            </div>
            <h3>No Conversations</h3>
            <p>Start a conversation by sending a message to someone from search results or profiles.</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.other_user_id}
              className={`conversation-item ${
                selectedConversation?.other_user_id === conversation.other_user_id ? 'active' : ''
              }`}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="conversation-user">
                <div className="conversation-avatar">
                  {getUserImageUrl(conversation) ? (
                    <img 
                      src={getUserImageUrl(conversation)}
                      alt={getDisplayName(conversation)}
                      className="avatar-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="avatar-initials"
                    style={{ display: getUserImageUrl(conversation) ? 'none' : 'flex' }}
                  >
                    {getUserInitials(conversation)}
                  </div>
                </div>
                <div className="conversation-info">
                  <h4 className="conversation-name">
                    {getDisplayName(conversation)}
                  </h4>
                  <p className="conversation-role">
                    {conversation.role || 'User'}
                  </p>
                </div>
              </div>
              
              <div className="conversation-preview">
                {conversation.last_message || 'No messages yet'}
              </div>
              
              <div className="conversation-meta">
                <span className="conversation-time">
                  <Clock size={12} />
                  {formatTime(conversation.last_message_time)}
                </span>
                {conversation.unread_count > 0 && (
                  <span className="unread-badge">
                    {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default ConversationsList;