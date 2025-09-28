import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Star, MessageCircle, User, Trash2 } from 'lucide-react';
import recommendationService from '@/api/services/recommendationService';
import playerService from '@/api/services/playerService';
import scoutService from '@/api/services/scoutService';
import { getToken } from '@/api/tokenStore';
import defaultPlayerImg from '@/assets/default-player.png';
import QuickMessageModal from '@/components/messages/QuickMessageModal';
import './styles/RecommendationsManager.css';

const RecommendationsManager = ({ 
  recommendations = [], 
  userRole, 
  onRecommendationUpdate, 
  showActions = true
}) => {
  const [loading, setLoading] = useState(false);
  const [playerDetails, setPlayerDetails] = useState({});
  const [scoutDetails, setScoutDetails] = useState({});
  const [messageModal, setMessageModal] = useState({
    show: false,
    recipientId: null,
    recipientName: '',
    recipientType: ''
  });
  const navigate = useNavigate();
  // Fetch player and scout details for all recommendations
  useEffect(() => {
    const fetchDetails = async () => {
      if (!recommendations.length) {
        return;
      }
      const token = getToken();
      const playerIds = [...new Set(recommendations.map(r => r.player_id))];
      const scoutIds = [...new Set(recommendations.map(r => r.scout_id))];
      try {
        // Fetch player details
        const playerPromises = playerIds.map(async (playerId) => {
          try {
            const result = await playerService.getPlayerFull(playerId, token);
            const player = result.player
            return { id: playerId, data: player };
          } catch (error) {
            console.error(`Failed to fetch player ${playerId}:`, error);
            return { id: playerId, data: null };
          }
        });

        // Fetch scout details
        const scoutPromises = scoutIds.map(async (scoutId) => {
          try {
            const scout = await scoutService.getScoutByScoutId(scoutId, token);
            return { id: scoutId, data: scout };
          } catch (error) {
            return { id: scoutId, data: null };
          }
        });
        const [playerResults, scoutResults] = await Promise.all([
          Promise.all(playerPromises),
          Promise.all(scoutPromises)
        ]);
        // Process results
        const playersMap = {};
        const scoutsMap = {};

        playerResults.forEach(({ id, data }) => {
          if (data) playersMap[id] = data;
        });

        scoutResults.forEach(({ id, data }) => {
          if (data) scoutsMap[id] = data;
        });
        setPlayerDetails(playersMap);
        setScoutDetails(scoutsMap);
      } catch (error) {
        console.error('Failed to fetch details:', error);
      }
    };

    fetchDetails();
  }, [recommendations]);

  const handleDeleteRecommendation = async (recommendationId) => {
    if (!window.confirm('Are you sure you want to delete this recommendation?')) {
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      await recommendationService.deleteRecommendation(recommendationId, token);
      
      if (onRecommendationUpdate) {
        onRecommendationUpdate();
      }
    } catch (error) {
      console.error('Failed to delete recommendation:', error);
      alert('Failed to delete recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (player) => {
    if (player?.user_id && player?.name) {
      setMessageModal({
        show: true,
        recipientId: player.user_id,
        recipientName: player.name,
        recipientType: 'Player'
      });
    } else {
      alert('Unable to send message - player information not available');
    }
  };

  const handleCloseModal = () => {
    setMessageModal({
      show: false,
      recipientId: null,
      recipientName: '',
      recipientType: ''
    });
  };

  const getPlayerImage = (player) => {
    // Check player object for photo
    if (player?.photo) {
      if (player.photo.startsWith('http')) {
        return player.photo;
      }
      return `http://localhost:3000/uploads/players/${player.photo}`;
    }
    
    // Default fallback
    return defaultPlayerImg;
  };

  if (loading && !recommendations.length) {
    return (
      <div className="recommendations-manager">
        <div className="empty-state">
          <div className="empty-icon">
            <Star size={48} />
          </div>
          <h4>Loading Recommendations...</h4>
          <p>Please wait while we fetch your recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-manager">
      <div className="recommendations-header">
        <h4>Player Recommendations ({recommendations.length})</h4>
        <p>Recommendations from scouts for your team</p>
      </div>

      <div className="recommendations-list">
        {recommendations.map((recommendation) => {
          const player = playerDetails[recommendation.player_id];
          const scout = scoutDetails[recommendation.scout_id];
          return (
            <div key={recommendation.id} className="player-card-extended recommendation-card">
              {/* Player Header Section */}
              <div className="player-header">
                <div className="player-avatar-section">
                  <img 
                    src={getPlayerImage(player)}
                    alt={player?.name || 'Player'} 
                    className="player-avatar-large"
                    onError={(e) => {
                      e.target.src = defaultPlayerImg;
                    }}
                  />
                </div>
                
                <div className="player-main-info">
                  <div className="player-name-section">
                    <h5 className="player-name-large text-white">
                      {player?.name || `Player #${recommendation.player_id}`}
                    </h5>
                    <div className="player-nationality">
                      {player?.nationality || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scout Info Section */}
              <div className="scout-info-section">
                <div className="scout-info-card">
                  <button 
                    className="scout-name-button"
                    onClick={() => {
                      if (scout?.scout?.id) {
                        navigate(`/scout/profile/${scout.scout.id}`);
                      } else {
                        const scoutName = scout?.scout.first_name && scout?.scout.last_name ? 
                          `${scout.scout.first_name} ${scout.scout.last_name}` : 
                          scout?.name || `Scout #${recommendation.scout_id}`;
                        alert(`Scout profile not available for ${scoutName}`);
                      }
                    }}
                    title="Click to view scout profile"
                  >
                    <span className="scout-label">Recommended by: </span>
                    {scout?.scout.first_name && scout?.scout.last_name ? 
                      `${scout.scout.first_name} ${scout.scout.last_name}` : 
                      scout?.name || `Scout #${recommendation.scout_id}`
                    }
                  </button>
                </div>
              </div>

              {/* Player Stats Grid */}
              <div className="player-stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Position</span>
                  <span className="stat-value">
                    {player?.position || 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Age</span>
                  <span className="stat-value">
                    {player?.age || 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Height</span>
                  <span className="stat-value">
                    {player?.height ? `${player.height}` : 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Weight</span>
                  <span className="stat-value">
                    {player?.weight ? `${player.weight}` : 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Club</span>
                  <span className="stat-value">
                    {player?.club || 'N/A'}
                  </span>
                </div>
               
              </div>

              {/* Recommendation Note */}
              <div className="recommendation-note">
                <div className="note-header">
                  <MessageCircle size={16} />
                  <span>Recommendation Note:</span>
                </div>
                <p className="note-content">
                  {recommendation.recommendation_note || 'No additional notes provided.'}
                </p>
              </div>

              {/* Action Buttons */}
              {showActions && userRole === 'team' && (
                <div className="action-buttons-grid">
                  <div className="action-row-top">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="action-btn profile-btn"
                      onClick={() => {
                        
                         if (player?.id) {
                          console.log('Navigating to player profile with id (fallback):', player.id);
                          navigate(`/player/profile/${player.id}`);
                        } else {
                          alert(`Player profile not available`);
                        }
                      }}
                    >
                      <User size={16} className="action-icon" />
                      View Profile
                    </Button>
                    
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="action-btn message-btn"
                      onClick={() => handleSendMessage(player)}
                    >
                      <MessageCircle size={16} className="action-icon" />
                      Message
                    </Button>
                    
                    <Button 
                      variant="outline-danger"
                      size="sm"
                      className="action-btn remove-btn" 
                      onClick={() => handleDeleteRecommendation(recommendation.id)}
                      disabled={loading}
                    >
                      <Trash2 size={16} className="action-icon" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Quick Message Modal */}
      <QuickMessageModal
        show={messageModal.show}
        onHide={handleCloseModal}
        recipientId={messageModal.recipientId}
        recipientName={messageModal.recipientName}
        recipientType={messageModal.recipientType}
      />
    </div>
  );
};

export default RecommendationsManager;