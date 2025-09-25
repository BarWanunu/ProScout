import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Star, MessageCircle, User, Trash2 } from 'lucide-react';
import recommendationService from '@/api/services/recommendationService';
import playerService from '@/api/services/playerService';
import scoutService from '@/api/services/scoutService';
import { getToken } from '@/api/tokenStore';
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

  console.log("RecommendationsManager props:", { 
    recommendations, 
    userRole, 
    showActions, 
    recommendationsLength: recommendations.length 
  });

  // Fetch player and scout details for all recommendations
  useEffect(() => {
    console.log("🔄 useEffect triggered with recommendations:", recommendations);
    console.log("🔄 recommendations.length:", recommendations.length);
    
    const fetchDetails = async () => {
      if (!recommendations.length) {
        console.log("❌ No recommendations to fetch details for");
        return;
      }

      console.log("✅ Starting to fetch details for recommendations:", recommendations);

      const token = getToken();
      console.log("🔐 Token:", token);
      
      const playerIds = [...new Set(recommendations.map(r => r.player_id))];
      const scoutIds = [...new Set(recommendations.map(r => r.scout_id))];

      console.log("👤 Player IDs to fetch:", playerIds);
      console.log("🔍 Scout IDs to fetch:", scoutIds);

      try {
        // Fetch player details
        const playerPromises = playerIds.map(async (playerId) => {
          try {
            console.log(`🔄 Fetching player ${playerId}...`);
            const result = await playerService.getPlayerFull(playerId, token);
            const player = result.player
            console.log(`✅ Player ${playerId} data:`, player);
            return { id: playerId, data: player };
          } catch (error) {
            console.error(`❌ Failed to fetch player ${playerId}:`, error);
            return { id: playerId, data: null };
          }
        });

        // Fetch scout details
        const scoutPromises = scoutIds.map(async (scoutId) => {
          try {
            console.log(`🔄 Fetching scout ${scoutId}...`);
            const scout = await scoutService.getScoutByScoutId(scoutId, token);
            console.log(`✅ Scout ${scoutId} data:`, scout);
            return { id: scoutId, data: scout };
          } catch (error) {
            console.error(`❌ Failed to fetch scout ${scoutId}:`, error);
            return { id: scoutId, data: null };
          }
        });

        console.log("🔄 Starting Promise.all for player and scout data...");
        const [playerResults, scoutResults] = await Promise.all([
          Promise.all(playerPromises),
          Promise.all(scoutPromises)
        ]);

        console.log("✅ Player results:", playerResults);
        console.log("✅ Scout results:", scoutResults);

        // Process results
        const playersMap = {};
        const scoutsMap = {};

        playerResults.forEach(({ id, data }) => {
          console.log(`Processing player ${id}:`, data);
          if (data) playersMap[id] = data;
        });

        scoutResults.forEach(({ id, data }) => {
          console.log(`Processing scout ${id}:`, data);
          if (data) scoutsMap[id] = data;
        });

        console.log("🎯 Final players map:", playersMap);
        console.log("🎯 Final scouts map:", scoutsMap);

        setPlayerDetails(playersMap);
        setScoutDetails(scoutsMap);
      } catch (error) {
        console.error('💥 Failed to fetch details:', error);
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
          
          console.log(`🔍 Recommendation ${recommendation.id}:`, recommendation);
          console.log(`👤 Player data for ID ${recommendation.player_id}:`, player);
          console.log(`🔍 Scout data for ID ${recommendation.scout_id}:`, scout);
          console.log(`📊 All player details:`, playerDetails);
          console.log(`📊 All scout details:`, scoutDetails);
          
          return (
            <Card key={recommendation.id} className="recommendation-card">
              <Card.Body>
                <div className="recommendation-content">
                  <div className="recommendation-left">
                    <div className="player-info">
                      <div className="player-avatar">
                        {player?.profile_image ? (
                          <img 
                            src={`http://localhost:3000/uploads/players/${player.profile_image}`} 
                            alt={player?.name || 'Player'} 
                            onError={(e) => {
                              console.log('❌ Image failed to load:', e.target.src);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <User size={40} />
                        )}
                      </div>
                      
                      <div className="player-details">
                        <h5 className="player-name">
                          {player?.name || `Player #${recommendation.player_id}`}
                        </h5>
                        {player ? (
                          <>
                            <div className="player-meta">
                              {player.position && (
                                <Badge variant="outline-primary" className="position-badge">
                                  {player.position}
                                </Badge>
                              )}
                              {player.age && (
                                <span className="player-age">{player.age} years</span>
                              )}
                              {player.nationality && (
                                <span className="player-nationality">{player.nationality}</span>
                              )}
                            </div>
                            
                            {/* Additional player info like shortlist */}
                            <div className="player-stats-row">
                              {player.height && (
                                <div className="stat-item">
                                  <span className="stat-label">Height:</span>
                                  <span className="stat-value">{player.height}cm</span>
                                </div>
                              )}
                              {player.weight && (
                                <div className="stat-item">
                                  <span className="stat-label">Weight:</span>
                                  <span className="stat-value">{player.weight}kg</span>
                                </div>
                              )}
                              {player.foot && (
                                <div className="stat-item">
                                  <span className="stat-label">Foot:</span>
                                  <span className="stat-value">{player.foot}</span>
                                </div>
                              )}
                            </div>
                            
                            {player.club_name && (
                              <div className="player-club">
                                <span className="club-label">Current Club:</span>
                                <span className="club-name">{player.club_name}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-muted">
                            <small>⚠️ Player not found (ID: {recommendation.player_id})</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="recommendation-right">
                    <div className="recommendation-details">
                      <div className="scout-info">
                        <span className="scout-label">Recommended by:</span>
                        <span className="scout-name">
                          {scout?.name || `Scout #${recommendation.scout_id}`}
                        </span>
                        {!scout && (
                          <small className="text-muted">⚠️ Scout not found (ID: {recommendation.scout_id})</small>
                        )}
                      </div>
                    </div>

                    <div className="recommendation-message">
                      <div className="message-header">
                        <MessageCircle size={16} />
                        <span>Recommendation Note:</span>
                      </div>
                      <p className="message-content">
                        {recommendation.recommendation_note || 'No additional notes provided.'}
                      </p>
                    </div>

                    {showActions && userRole === 'team' && (
                      <div className="recommendation-actions">
                        <Button
                          variant="primary"
                          onClick={() => {
                            // TODO: Navigate to player profile
                            console.log('View player:', player);
                            alert(`Viewing ${player?.name || 'Player'} profile - Feature coming soon!`);
                          }}
                        >
                          <User size={16} className="me-1" />
                          View Profile
                        </Button>
                        
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDeleteRecommendation(recommendation.id)}
                          disabled={loading}
                        >
                          <Trash2 size={16} className="me-1" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationsManager;