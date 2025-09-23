import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { UserMinus, Send, Search, MessageCircle, User } from 'lucide-react';
import shortlistService from '@/api/services/shortlistService';
import playerService from '@/api/services/playerService';
import { getToken } from '@/api/tokenStore';
import '../styles/ShortlistTab.css';

const ShortlistTab = ({ shortlist: initialShortlist = [], onSwitchToSearch, onRefreshShortlist }) => {
  const [shortlist, setShortlist] = useState(initialShortlist);
  const [loading, setLoading] = useState({});
  const [playerDetails, setPlayerDetails] = useState({});
  const [fetchingDetails, setFetchingDetails] = useState({});
  
  // Update local shortlist when initialShortlist prop changes
  useEffect(() => {
    setShortlist(initialShortlist);
  }, [initialShortlist]);

  // Fetch additional player details when component mounts or shortlist changes
  useEffect(() => {
    const fetchPlayerDetails = async () => {
      if (!shortlist || shortlist.length === 0) return;
      
      const token = getToken();
      for (const player of shortlist) {
        try {
          if (!playerDetails[player.player_id]) {
            setFetchingDetails(prev => ({ ...prev, [player.player_id]: true }));
            const details = await playerService.getPlayerFull(player.player_id);
            setPlayerDetails(prev => ({ 
              ...prev, 
              [player.player_id]: details 
            }));
          }
        } catch (error) {
          console.error(`Failed to fetch details for player ${player.player_id}:`, error);
        } finally {
          setFetchingDetails(prev => ({ ...prev, [player.player_id]: false }));
        }
      }
    };
    
    fetchPlayerDetails();
  }, [shortlist]);
  
  // אם אין שחקנים ברשימת המועדפים
  if (!shortlist || shortlist.length === 0) {
    return (
      <Container className="py-4 shortlist-empty">
        <Card className="text-center p-5">
          <h4 className="mb-3">Your Shortlist is Empty</h4>
          <p>
            Add players to your shortlist to keep track of talents you're interested in.
            Use the search feature to find and add players.
          </p>
          <div className="mt-4">
            <Button variant="primary" onClick={() => onSwitchToSearch?.()}>
              <Search size={16} className="me-2" /> Search Players
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // הסרת שחקן מהרשימה
  const handleRemovePlayer = async (playerId) => {
    try {
      setLoading(prev => ({ ...prev, [playerId]: true }));
      const token = getToken();
      await shortlistService.removePlayer(playerId, token);
      setShortlist(prevShortlist => prevShortlist.filter(player => player.player_id !== playerId));
      // Refresh the parent shortlist data
      if (onRefreshShortlist) {
        console.log('Refreshing shortlist after removing player...');
        await onRefreshShortlist();
      }
    } catch (error) {
      console.error("Failed to remove player from shortlist:", error);
      alert("Failed to remove player from shortlist. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [playerId]: false }));
    }
  };

  // שליחת הזמנה למבחן (לא מיושם עדיין)
  const handleSendTrialInvitation = (playerId) => {
    console.log(`Sending trial invitation to player with ID: ${playerId}`);
    // כאן יהיה הקוד בהמשך
  };

  // שליחת הודעה לשחקן (לא מיושם עדיין)
  const handleSendMessage = (playerId) => {
    console.log(`Sending message to player with ID: ${playerId}`);
    // כאן יהיה הקוד בהמשך
  };

  // צפייה בפרופיל השחקן
  const handleViewProfile = (playerId) => {
    console.log(`Viewing profile of player with ID: ${playerId}`);
    // כאן יהיה הקוד בהמשך - ניווט לפרופיל
    alert(`Opening profile for player ${playerId}`);
  };

  const getPlayerDetail = (playerId, field) => {
    if (playerDetails[playerId]?.player) {
      return playerDetails[playerId].player[field] || 'N/A';
    }
    return 'N/A';
  };

  const getPlayerImage = (player, playerId) => {
    // Check player object for photo
    if (player.photo) {
      if (player.photo.startsWith('http')) {
        return player.photo;
      }
      return `${import.meta.env.VITE_API_BASE_URL}/${player.photo}`;
    }
    
    // Check player details for photo
    const detailPhoto = getPlayerDetail(playerId, 'photo');
    if (detailPhoto !== 'N/A' && detailPhoto) {
      if (detailPhoto.startsWith('http')) {
        return detailPhoto;
      }
      return `${import.meta.env.VITE_API_BASE_URL}/${detailPhoto}`;
    }
    
    // Default fallback
    return '/assets/default-player.png';
  };

  return (
    <div className="shortlist-tab">
      <div className="shortlist-header">
        <h4>Your Player Shortlist</h4>
        <p>Players you've marked as interesting for your team</p>
      </div>

      <div className="shortlist-container">
        {shortlist.map((player) => (
          <div key={player.player_id} className="player-card-extended">
            <div className="player-header">
              <div className="player-avatar-section">
                {fetchingDetails[player.player_id] ? (
                  <div className="avatar-placeholder">
                    <Spinner size="sm" animation="border" />
                  </div>
                ) : (
                  <img 
                    src={getPlayerImage(player, player.player_id)}
                    alt={player.name || getPlayerDetail(player.player_id, 'name')} 
                    className="player-avatar-large"
                    onError={(e) => {
                      console.log('Image failed to load, using default');
                      e.target.src = '/assets/default-player.png';
                    }}
                  />
                )}
              </div>
              
              <div className="player-main-info">
                <div className="player-name-section">
                  <h5 className="player-name-large text-white">
                    {player.name || getPlayerDetail(player.player_id, 'name')}
                  </h5>
                  <div className="player-nationality">
                    {player.nationality || getPlayerDetail(player.player_id, 'nationality') || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>

            <div className="player-stats-grid">
              <div className="stat-item">
                <span className="stat-label">Position</span>
                <span className="stat-value">
                  {player.position || getPlayerDetail(player.player_id, 'position') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Age</span>
                <span className="stat-value">
                  {player.age || getPlayerDetail(player.player_id, 'age') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Height</span>
                <span className="stat-value">
                  {getPlayerDetail(player.player_id, 'height') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Weight</span>
                <span className="stat-value">
                  {getPlayerDetail(player.player_id, 'weight') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Club</span>
                <span className="stat-value">
                  {player.club || getPlayerDetail(player.player_id, 'club') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Birthdate</span>
                <span className="stat-value">
                  {getPlayerDetail(player.player_id, 'birthdate') ? new Date(getPlayerDetail(player.player_id, "birthdate")).toLocaleDateString('en-GB'): 'N/A'}
                </span>
              </div>
            </div>

            <div className="action-buttons-grid">
              <div className="action-row-top">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="action-btn trial-btn"
                  onClick={() => handleSendTrialInvitation(player.player_id)}
                >
                  <Send size={16} className="action-icon" />
                  Trial
                </Button>
                
                <Button 
                  variant="info" 
                  size="sm" 
                  className="action-btn profile-btn"
                  onClick={() => handleViewProfile(player.player_id)}
                >
                  <User size={16} className="action-icon" />
                  Profile
                </Button>
              </div>
              
              <div className="action-row-bottom">
                <Button 
                  variant="success" 
                  size="sm" 
                  className="action-btn message-btn"
                  onClick={() => handleSendMessage(player.player_id)}
                >
                  <MessageCircle size={16} className="action-icon" />
                  Message
                </Button>
                
                <Button 
                  variant="danger"
                  size="sm"
                  className="action-btn remove-btn" 
                  onClick={() => handleRemovePlayer(player.player_id)}
                  disabled={loading[player.player_id]}
                >
                  {loading[player.player_id] ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <>
                      <UserMinus size={16} className="action-icon" />
                      Remove
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortlistTab;