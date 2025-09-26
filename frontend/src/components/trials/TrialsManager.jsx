import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Calendar, Check, X, Trash2, User, MessageCircle } from 'lucide-react';
import trialService from '@/api/services/trialService';
import playerService from '@/api/services/playerService';
import scoutService from '@/api/services/scoutService';
import teamService from '@/api/services/teamService';
import { getToken } from '@/api/tokenStore';
import './styles/TrialsManager.css';

const TrialsManager = ({ 
  trials = [], 
  userRole, 
  onTrialUpdate, 
  showActions = true 
}) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');
  const [playerDetails, setPlayerDetails] = useState({});
  const [senderDetails, setSenderDetails] = useState({});
  const [teamDetails, setTeamDetails] = useState({});
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

  // Fetch team details for trials where recipient is team
  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!trials || trials.length === 0) return;
      
      for (const trial of trials) {
        try {
          // If sender is player or scout, recipient is team
          if ((trial.sender_role === 'player' || trial.sender_role === 'scout') && trial.team_id) {
            if (!teamDetails[trial.team_id]) {
              setFetchingDetails(prev => ({ ...prev, [`team_${trial.team_id}`]: true }));
              const teamData = await teamService.getTeamByTeamId(trial.team_id);
              setTeamDetails(prev => ({ 
                ...prev, 
                [trial.team_id]: teamData.team || teamData
              }));
            }
          }
        } catch (error) {
          console.error(`Failed to fetch team details for team ${trial.team_id}:`, error);
        } finally {
          setFetchingDetails(prev => ({ ...prev, [`team_${trial.team_id}`]: false }));
        }
      }
    };
    
    fetchTeamDetails();
  }, [trials]);

  // Fetch sender details for all trials
  useEffect(() => {
    const fetchSenderDetails = async () => {
      if (!trials || trials.length === 0) return;
      
      const token = getToken();
      for (const trial of trials) {
        try {
          const senderKey = `${trial.sender_role}_${trial.scout_id || trial.team_id || trial.player_id}`;
          
          if (!senderDetails[senderKey]) {
            setFetchingDetails(prev => ({ ...prev, [senderKey]: true }));
            
            let details = null;
            if (trial.sender_role === 'scout' && trial.scout_id) {
              details = await scoutService.getScoutByScoutId(trial.scout_id);
            } else if (trial.sender_role === 'team' && trial.team_id) {
              const teamData = await teamService.getTeamByTeamId(trial.team_id);
              details = teamData.team; // Extract team object from response
            } else if (trial.sender_role === 'player' && trial.player_id) {
              const playerData = await playerService.getPlayerFull(trial.player_id);
              details = playerData.player;
            }
            
            if (details) {
              setSenderDetails(prev => ({ 
                ...prev, 
                [senderKey]: { 
                  ...details, 
                  role: trial.sender_role 
                } 
              }));
            }
          }
        } catch (error) {
          console.error(`Failed to fetch sender details for ${trial.sender_role}:`, error);
        } finally {
          const senderKey = `${trial.sender_role}_${trial.scout_id || trial.team_id || trial.player_id}`;
          setFetchingDetails(prev => ({ ...prev, [senderKey]: false }));
        }
      }
    };
    
    fetchSenderDetails();
  }, [trials]);

  // Helper function to get sender name
  const getSenderName = (trial) => {
    const senderKey = `${trial.sender_role}_${trial.scout_id || trial.team_id || trial.player_id}`;
    const senderData = senderDetails[senderKey];
    
    // Check if data is loading
    if (fetchingDetails[senderKey]) return 'Loading...';
    if (!senderData) return 'Loading...';
    
    
    switch (trial.sender_role) {
      case 'scout':
        return senderData.first_name && senderData.last_name 
          ? `${senderData.first_name} ${senderData.last_name}` 
          : senderData.username || 'Unknown Scout';
      case 'team':
        return senderData.team_name || senderData.name || 'Unknown Team';
      case 'player':
        return senderData.first_name && senderData.last_name 
          ? `${senderData.first_name} ${senderData.last_name}` 
          : senderData.username || 'Unknown Player';
      default:
        return 'Unknown Sender';
    }
  };

  // Helper function to get recipient name and role
  const getRecipientInfo = (trial) => {
    if (trial.sender_role === 'team') {
      // Team sent to Player
      const playerName = getPlayerDetail(trial.player_id, 'name') || 'Unknown Player';
      return { name: playerName, role: 'player' };
    } else if (trial.sender_role === 'player' || trial.sender_role === 'scout') {
      // Player/Scout sent to Team
      if (trial.team_id) {
        // Check if team data is loading
        if (fetchingDetails[`team_${trial.team_id}`]) {
          return { name: 'Loading...', role: 'team' };
        }
        
        const teamData = teamDetails[trial.team_id];
        if (teamData) {
          const teamName = teamData.team_name || teamData.name || 'Unknown Team';
          return { name: teamName, role: 'team' };
        }
      }
      return { name: 'Unknown Team', role: 'team' };
    }
    return { name: 'Unknown', role: 'unknown' };
  };

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

  // Handle sending message to trial sender
  const handleSendMessage = (trial) => {
    const senderName = getSenderName(trial);
    
    // TODO: Implement messaging functionality
    alert(`Send message to: ${senderName} (${trial.sender_role})`);
    console.log('Sending message to:', {
      senderRole: trial.sender_role,
      scoutId: trial.scout_id,
      teamId: trial.team_id,
      playerId: trial.player_id,
      senderName: senderName
    });
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

    // Trial Logic Based on Sender and Recipient
    
    // Case 1: Team sent an invitation to Player
    if (trial.sender_role === 'team') {
      // Only the Player can accept/decline this type of trial
      if (userRole === 'player') {
        if (status === 'pending') {
          actions.push('accept', 'decline');
        }
        // Player can delete trials they declined
        if (status === 'declined') {
          actions.push('delete');
        }
      }
      // Team can only delete declined trials they sent
      else if (userRole === 'team') {
        if (status === 'declined') {
          actions.push('delete');
        }
      }
    } 
    
    // Case 2: Player requests trial from Team
    // OR Case 3: Scout recommends Player to Team
    else if (trial.sender_role === 'player' || trial.sender_role === 'scout') {
      // Only the Team can accept/decline these trial types
      if (userRole === 'team') {
        if (status === 'pending') {
          actions.push('accept', 'decline');
        }
        if (status === 'declined') {
          actions.push('delete');
        }
      }
    }
    
    // All user roles can delete their own sent trials if needed
    if (userRole === trial.sender_role && status === 'pending') {
      if (!actions.includes('delete')) {
        actions.push('delete');
      }
    }

    return actions;
  };

  if (!trials.length) {
    return (
      <Container className="py-4">
        <Card className="text-center p-5">
          <h4 className="mb-3 text-white">No Trial Invitations</h4>
          <p className='text-white mb-0'>
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
                {/* Trial sent by and sent to header */}
                <div className="trial-sender-header">
                  <div className="trial-info-row">
                    <div className="sender-info">
                      <span className="sender-label">Trial sent by:</span>
                      <span className="sender-name">{getSenderName(trial)}</span>
                      <span className="sender-role">({trial.sender_role})</span>
                    </div>
                    <div className="recipient-info">
                      <span className="recipient-label">Trial sent to:</span>
                      <span className="recipient-name">{getRecipientInfo(trial).name}</span>
                      <span className="recipient-role">({getRecipientInfo(trial).role})</span>
                    </div>
                  </div>
                  <button 
                    className="message-sender-btn"
                    onClick={() => handleSendMessage(trial)}
                    title={`Send message to ${getSenderName(trial)}`}
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                </div>
                
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