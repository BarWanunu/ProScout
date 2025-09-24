import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Calendar, Check, X, Trash2, User } from 'lucide-react';
import trialService from '@/api/services/trialService';
import playerService from '@/api/services/playerService';
import { getToken } from '@/api/tokenStore';
import './TrialsManager.css';

const TrialsManager = ({ 
  trials = [], 
  userRole, 
  onTrialUpdate, 
  showActions = true 
}) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');
  const [playerDetails, setPlayerDetails] = useState({});
  const [fetchingDetails, setFetchingDetails] = useState({});

  // Fetch player details for all trials
  useEffect(() => {
    const fetchPlayerDetails = async () => {
      if (!trials || trials.length === 0) return;
      
      const token = getToken();
      for (const trial of trials) {
        try {
          if (!playerDetails[trial.player_id]) {
            setFetchingDetails(prev => ({ ...prev, [trial.player_id]: true }));
            const details = await playerService.getPlayerFull(trial.player_id);
            setPlayerDetails(prev => ({ 
              ...prev, 
              [trial.player_id]: details 
            }));
          }
        } catch (error) {
          console.error(`Failed to fetch details for player ${trial.player_id}:`, error);
        } finally {
          setFetchingDetails(prev => ({ ...prev, [trial.player_id]: false }));
        }
      }
    };
    
    fetchPlayerDetails();
  }, [trials]);

  // Handle status update
  const handleStatusUpdate = async (trialId, newStatus) => {
    try {
      setLoading(prev => ({ ...prev, [trialId]: true }));
      const token = getToken();

      await trialService.updateTrialStatus(trialId, newStatus, token);
      
      if (onTrialUpdate) {
        await onTrialUpdate();
      }
    } catch (error) {
      console.error(`Failed to update trial status:`, error);
      setError(`Failed to update trial status. Please try again.`);
    } finally {
      setLoading(prev => ({ ...prev, [trialId]: false }));
    }
  };

  // Handle trial deletion
  const handleDeleteTrial = async (trialId) => {
    if (!window.confirm('Are you sure you want to delete this trial invitation?')) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [trialId]: true }));
      const token = getToken();
      await trialService.deleteTrial(trialId, token);
      
      if (onTrialUpdate) {
        await onTrialUpdate();
      }
    } catch (error) {
      console.error(`Failed to delete trial:`, error);
      setError(`Failed to delete trial. Please try again.`);
    } finally {
      setLoading(prev => ({ ...prev, [trialId]: false }));
    }
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'declined':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  // Get player detail from fetched data
  const getPlayerDetail = (playerId, field) => {
    if (playerDetails[playerId]?.player) {
      return playerDetails[playerId].player[field] || 'N/A';
    }
    return 'N/A';
  };

  // Get player image with fallback
  const getPlayerImage = (playerId) => {
    const player = playerDetails[playerId]?.player;
    if (!player) return '/assets/default-player.png';
    
    if (player.photo) {
      if (player.photo.startsWith('http')) {
        return player.photo;
      }
      return `${import.meta.env.VITE_API_BASE_URL}/${player.photo}`;
    }
    
    return '/assets/default-player.png';
  };

  // Determine which actions to show based on user role and trial status
  const getAvailableActions = (trial) => {
    if (!showActions) return [];

    const actions = [];
    const status = trial.status?.toLowerCase();

    // Team can always accept/decline trials sent to them
    if (userRole === 'team') {
      if (status === 'pending') {
        actions.push('accept', 'decline');
      }
      if (status === 'declined') {
        actions.push('delete');
      }
    }
    
    // Player can accept/decline trials sent to them by teams
    if (userRole === 'player' && trial.sender_role === 'team') {
      if (status === 'pending') {
        actions.push('accept', 'decline');
      }
    }
    
    // Scout can only view trials they sent (no actions)
    if (userRole === 'scout') {
      // Scouts can only view, no actions for now
    }

    return actions;
  };

  if (!trials.length) {
    return (
      <Container className="py-4">
        <Card className="text-center p-5">
          <h4 className="mb-3">No Trial Invitations</h4>
          <p>
            {userRole === 'team' && 'No trial invitations have been sent to your team yet.'}
            {userRole === 'player' && 'You have no trial invitations at the moment.'}
            {userRole === 'scout' && 'You haven\'t sent any trial invitations yet.'}
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <div className="trials-manager">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <div className="trials-list">
        {trials.map((trial) => {
          const availableActions = getAvailableActions(trial);
          
          return (
            <Card key={trial.id} className="trial-card mb-3">
              <Card.Body className="p-3">
                <div className="trial-row">
                  {/* Left Section: Avatar and Player Info */}
                  <div className="trial-left-section">
                    {/* Player Avatar */}
                    <div className="trial-avatar">
                      {fetchingDetails[trial.player_id] ? (
                        <div className="avatar-placeholder">
                          <Spinner size="sm" animation="border" />
                        </div>
                      ) : !getPlayerImage(trial.player_id) ? (
                        <div className="avatar-placeholder">
                          <User size={30} color="#94a3b8" />
                        </div>
                      ) : (
                        <img 
                          src={getPlayerImage(trial.player_id)}
                          alt={getPlayerDetail(trial.player_id, 'name')}
                          className="trial-player-avatar"
                          onError={(e) => {
                            e.target.src = '/assets/default-player.png';
                          }}
                        />
                      )}
                      <button 
                        className="view-profile-btn"
                        onClick={() => {/* TODO: Navigate to player profile */}}
                      >
                        View Profile
                      </button>
                    </div>
                    
                    {/* Player Info */}
                    <div className="trial-info">
                      <div className="trial-player-name">
                        {getPlayerDetail(trial.player_id, 'name')}
                      </div>
                      <div className="trial-player-age">
                        Age: {getPlayerDetail(trial.player_id, 'age') || 'N/A'}
                      </div>
                      <div className="trial-player-position">
                        {getPlayerDetail(trial.player_id, 'position') || 'N/A'}
                      </div>
                      <div className="trial-player-club">
                        {getPlayerDetail(trial.player_id, 'club') || 'N/A'}
                      </div>
                      <div className="trial-player-nationality">
                        {getPlayerDetail(trial.player_id, 'nationality') || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Message */}
                  {trial.invitation_message && (
                    <div className="trial-message">
                      <span className={`message-text status-${trial.status.toLowerCase()}`}>
                        {trial.invitation_message}
                      </span>
                    </div>
                  )}
                  
                  {/* Right Section: Date, Status, Actions */}
                  <div className="trial-right-section">
                    {/* Trial Date */}
                    <div className="trial-date">
                      <Calendar size={16} className="me-1" />
                      {formatDate(trial.trial_date)}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="trial-status">
                      <Badge variant={getStatusVariant(trial.status)}>
                        {trial.status}
                      </Badge>
                    </div>
                    
                    {/* Actions */}
                    {availableActions.length > 0 && (
                      <div className="trial-actions">
                        {availableActions.includes('accept') && (
                          <Button 
                            variant="success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleStatusUpdate(trial.id, 'accepted')}
                            disabled={loading[trial.id]}
                          >
                            {loading[trial.id] ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              <>
                                <Check size={14} />
                                Accept
                              </>
                            )}
                          </Button>
                        )}
                        
                        {availableActions.includes('decline') && (
                          <Button 
                            variant="danger"
                            size="sm"
                            className="me-1"
                            onClick={() => handleStatusUpdate(trial.id, 'declined')}
                            disabled={loading[trial.id]}
                          >
                            {loading[trial.id] ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              <>
                                <X size={14} />
                                Decline
                              </>
                            )}
                          </Button>
                        )}
                        
                        {availableActions.includes('delete') && (
                          <Button 
                            size="sm"
                            onClick={() => handleDeleteTrial(trial.id)}
                            disabled={loading[trial.id]}
                          >
                            {loading[trial.id] ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </Button>
                        )}
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

export default TrialsManager;