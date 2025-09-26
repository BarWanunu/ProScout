import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Users, User, MessageCircle, Calendar } from 'lucide-react';
import recommendationService from '@/api/services/recommendationService';
import teamService from '@/api/services/teamService';
import scoutService from '@/api/services/scoutService';
import { TeamProfile } from '@/components/profile';
import { useAuth } from '@/auth/AuthContext';
import { getToken } from '@/api/tokenStore';
import useProfileNavigation from '@/hooks/useProfileNavigation';
import '../../team/styles/ShortlistTab.css';

const PlayerRecommendationsTab = ({ player }) => {
  const { id: currentUserId } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamDetails, setTeamDetails] = useState({});
  const [scoutDetails, setScoutDetails] = useState({});
  const [fetchingDetails, setFetchingDetails] = useState({});

  // Profile navigation
  const { 
    currentProfile,
    navigateToProfile,
    goBack,
    isProfileOpen 
  } = useProfileNavigation();

  // Render current profile
  const renderProfile = () => {
    if (!currentProfile) return null;

    switch (currentProfile.type) {
      case 'team':
        return (
          <TeamProfile
            teamId={currentProfile.id}
            onBack={goBack}
            onNavigateToProfile={navigateToProfile}
          />
        );
      default:
        return (
          <div className="text-center p-4">
            <h3>Profile type not supported</h3>
            <Button variant="primary" onClick={goBack}>
              Go Back
            </Button>
          </div>
        );
    }
  };

  // Load recommendations for this player
  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      
      // Get recommendations for the current player using player_id
      const response = await recommendationService.getRecommendationsByPlayer(player.id, token);      
      
      console.log('Player recommendations loaded:', response);
      
      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error('Error loading player recommendations:', error);
      setError('Failed to load recommendations. Please try again.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load team and scout details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!recommendations || recommendations.length === 0) return;
      
      for (const recommendation of recommendations) {
        try {
          // Fetch team details
          if (recommendation.teams_id && !teamDetails[recommendation.teams_id]) {
            setFetchingDetails(prev => ({ ...prev, [`team_${recommendation.teams_id}`]: true }));
            const teamData = await teamService.getTeamByTeamId(recommendation.teams_id);
            setTeamDetails(prev => ({ 
              ...prev, 
              [recommendation.teams_id]: teamData.team || teamData
            }));
          }

          // Fetch scout details
          if (recommendation.scout_id && !scoutDetails[recommendation.scout_id]) {
            setFetchingDetails(prev => ({ ...prev, [`scout_${recommendation.scout_id}`]: true }));
            const scoutData = await scoutService.getScoutByScoutId(recommendation.scout_id);
            console.log('Scout data loaded:', scoutData);
            setScoutDetails(prev => ({ 
              ...prev, 
              [recommendation.scout_id]: scoutData.scout || scoutData
            }));
          }
        } catch (error) {
          console.error(`Failed to fetch details for recommendation ${recommendation.id}:`, error);
        } finally {
          setFetchingDetails(prev => ({ 
            ...prev, 
            [`team_${recommendation.teams_id}`]: false,
            [`scout_${recommendation.scout_id}`]: false
          }));
        }
      }
    };
    
    fetchDetails();
  }, [recommendations]);

  // Load recommendations when component mounts
  useEffect(() => {
    if (player?.id) {
      loadRecommendations();
    }
  }, [player]);

  // Navigate to trial creation page
  const handleRequestTrial = (teamId) => {
    const team = teamDetails[teamId];
    const teamName = team?.team_name || team?.name || 'Unknown Team';
    
    // Get player name from player object
    const playerName = player?.name || `${player?.first_name || ''} ${player?.last_name || ''}`.trim() || 'Player';
    
    // Navigate to create trial page with player and team info
    navigate(`/trial/create?playerId=${player.id}&playerName=${encodeURIComponent(playerName)}&teamId=${teamId}&teamName=${encodeURIComponent(teamName)}`);
  };

  // View team profile
  const handleViewProfile = (teamId) => {
    console.log(`Navigating to team profile: ${teamId}`);
    navigate(`/team/profile/${teamId}`);
  };

  // Send message to team (placeholder)
  const handleSendMessage = (teamId) => {
    console.log(`Sending message to team with ID: ${teamId}`);
    alert(`Sending message to team ${teamId}`);
  };

  // Get team detail from fetched data
  const getTeamDetail = (teamId, field) => {
    if (teamDetails[teamId]) {
      return teamDetails[teamId][field] || 'N/A';
    }
    return 'N/A';
  };

  // Get scout detail from fetched data
  const getScoutDetail = (scoutId, field) => {
    if (scoutDetails[scoutId]) {
      return scoutDetails[scoutId][field] || 'N/A';
    }
    return 'N/A';
  };

  // Get scout name
  const getScoutName = (scoutId) => {
    const scout = scoutDetails[scoutId];
    if (!scout) return 'Unknown Scout';
    
    if (scout.first_name && scout.last_name) {
      return `${scout.first_name} ${scout.last_name}`;
    }
    return scout.username || 'Unknown Scout';
  };

  const getScoutExperience = (scoutId) => {
    const scout = scoutDetails[scoutId];
    if (!scout) return 'N/A years';
    
    if (scout.experience_years) {
      return `${scout.experience_years} years`;
    }
    return 'N/A years';
  };

  // Get team logo with fallback
  const getTeamLogo = (teamId) => {
    const team = teamDetails[teamId];
    if (!team) return '/assets/default-team.png';
    
    if (team.logo) {
      if (team.logo.startsWith('http')) {
        return team.logo;
      }
      return `${import.meta.env.VITE_API_BASE_URL}/${team.logo}`;
    }
    
    return '/assets/default-team.png';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading recommendations...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
        <div className="mt-2">
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={loadRecommendations}
          >
            Try Again
          </button>
        </div>
      </Alert>
    );
  }

  // If no recommendations for this player
  if (!recommendations || recommendations.length === 0) {
    return (
      <Container className="py-4 shortlist-empty">
        <Card className="text-center p-5">
          <Users size={48} className="mb-3 text-white" />
          <p className="text-white mb-0">
            No scouts have recommended you to teams yet.
            Keep improving your profile and stats to attract scout attention!
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <>
      {/* Show profile if one is open */}
      {isProfileOpen && renderProfile()}
      
      {/* Show recommendations when no profile is open */}
      {!isProfileOpen && (
        <div className="player-recommendations-tab">
      <div className="shortlist-header mb-3">
        <h4 className="text-white">Scout Recommendations</h4>
        <p className="text-muted mb-0">
          {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} from scouts to teams
        </p>
      </div>

      <div className="shortlist-container">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="player-card-extended">
            <div className="player-header">
              <div className="player-avatar-section">
                {fetchingDetails[`team_${recommendation.teams_id}`] ? (
                  <div className="avatar-placeholder">
                    <Spinner size="sm" animation="border" />
                  </div>
                ) : (
                  <img 
                    src={getTeamLogo(recommendation.teams_id)}
                    alt={getTeamDetail(recommendation.teams_id, 'team_name')} 
                    className="player-avatar-large team-logo-large"
                    onError={(e) => {
                      e.target.src = '/assets/default-team.png';
                    }}
                  />
                )}
              </div>
              
              <div className="player-main-info">
                <div className="player-name-section">
                  <h5 className="player-name-large text-white">
                    {getTeamDetail(recommendation.teams_id, 'team_name')}
                  </h5>
                  <div className="player-nationality">
                    Recommended by {getScoutName(recommendation.scout_id)}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation note */}
            {recommendation.recommendation_note && (
              <div className="mb-3 p-3" style={{
                background: 'rgba(59, 130, 246, 0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(59, 130, 246, 0.15)'
              }}>
                <div className="text-white" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                  "{recommendation.recommendation_note}"
                </div>
              </div>
            )}

            <div className="player-stats-grid">
              <div className="stat-item">
                <span className="stat-label">League</span>
                <span className="stat-value">
                  {getTeamDetail(recommendation.teams_id, 'league') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Formation</span>
                <span className="stat-value">
                  {getTeamDetail(recommendation.teams_id, 'formation') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Stadium</span>
                <span className="stat-value">
                  {getTeamDetail(recommendation.teams_id, 'stadium') || 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Recommended On</span>
                <span className="stat-value">
                  {formatDate(recommendation.created_at)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Scout Experience</span>
                <span className="stat-value">
                  {getScoutDetail(recommendation.scout_id, 'experience_years') || 'N/A'} years
                </span>
              </div>
            </div>

            <div className="action-buttons-row">
              <Button 
                variant="primary" 
                size="sm" 
                className="action-btn trial-btn"
                onClick={() => handleRequestTrial(recommendation.teams_id)}
              >
                <Calendar size={16} className="action-icon" />
                Request Trial
              </Button>
              
              <Button 
                variant="info" 
                size="sm" 
                className="action-btn profile-btn"
                onClick={() => handleViewProfile(recommendation.teams_id)}
              >
                <User size={16} className="action-icon" />
                Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
      )}
    </>
  );
};

export default PlayerRecommendationsTab;