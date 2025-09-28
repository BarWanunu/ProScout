import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, XSquare, User, Building, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import trialService from '@/api/services/trialService';
import scoutService from '@/api/services/scoutService';
import teamService from '@/api/services/teamService';
import playerService from '@/api/services/playerService';
import { getToken } from '@/api/tokenStore';
import './TrialInvitationsList.css';

/**
 * Component to display trial invitations at the top of the page
 * Similar to how shortlisted players are displayed
 */
const TrialInvitationsList = ({ onRefresh, skipInitialFetch = false }) => {
  const { id, role } = useAuth();
  const navigate = useNavigate();
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(!skipInitialFetch);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [hasInitialFetch, setHasInitialFetch] = useState(!skipInitialFetch);
  const [senderDetails, setSenderDetails] = useState({});
  const [fetchingDetails, setFetchingDetails] = useState({});

  // Fetch trials on component mount and when refresh is triggered
  useEffect(() => {
    // Don't fetch on initial render if skipInitialFetch is true
    if (skipInitialFetch && !hasInitialFetch) {
      setLoading(false);
      setHasInitialFetch(true);
      return;
    }
    
    // Check if we have required data before fetching
    if (!id || !role) {
      console.error('TrialInvitationsList: Missing id or role', { id, role });
      setError('Unable to fetch trial invitations - missing user data');
      setLoading(false);
      return;
    }
    
    const token = getToken();
    if (!token) {
      console.error('TrialInvitationsList: Missing authentication token');
      setError('Unable to fetch trial invitations - authentication required');
      setLoading(false);
      return;
    }
    fetchTrials();
  }, [id, role, onRefresh, hasInitialFetch]);

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
              const response = await scoutService.getScoutByScoutId(trial.scout_id);              
              details = response.scout || response;
            } else if (trial.sender_role === 'team' && trial.team_id) {
              const response = await teamService.getTeamByTeamId(trial.team_id);
              details = response.team || response;
            } else if (trial.sender_role === 'player' && trial.player_id) {
              const response = await playerService.getPlayerFull(trial.player_id, token);
              details = response.player || response;
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

  const fetchTrials = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }
      
      if (!id) {
        throw new Error('User ID not available');
      }
      let response;
      
      // Get trials based on user role
      if (role === 'player') {
        response = await trialService.getTrialsByPlayer(id, token);
      } else if (role === 'team') {
        response = await trialService.getTrialsByTeam(id, token);
      } else if (role === 'scout') {
        response = await trialService.getTrialsByScout(id, token);
      } else {
        setTrials([]);
        return;
      }
      if (response?.trials) {
        // Sort trials by date (most recent first) and status (pending first)
        const sortedTrials = response.trials.sort((a, b) => {
          // First sort by status (pending first)
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          
          // Then sort by date (newer first)
          return new Date(b.trial_date) - new Date(a.trial_date);
        });
        setTrials(sortedTrials);
      } else {
        setTrials([]);
      }
    } catch (err) {
      console.error('Failed to fetch trials:', err);
      setError('Failed to load trial invitations');
      setTrials([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting or declining a trial invitation
  const handleTrialStatusUpdate = async (trialId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [trialId]: true }));
      
      const token = getToken();
      await trialService.updateTrialStatus(trialId, newStatus, token);
      
      // Refresh trials after update
      await fetchTrials();
      
      // Notify parent component if needed
      if (onRefresh) onRefresh();
      
    } catch (err) {
      console.error(`Failed to ${newStatus} trial:`, err);
      alert(`Failed to ${newStatus} trial invitation. Please try again.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [trialId]: false }));
    }
  };

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
          : senderData.name || 'Unknown Player';
      default:
        return 'Unknown Sender';
    }
  };

  const getSenderExperience = (trial) => {
    if (trial.sender_role !== 'scout') return '';
    
    const senderKey = `${trial.sender_role}_${trial.scout_id || trial.team_id || trial.player_id}`;
    const senderData = senderDetails[senderKey];
    
    if (!senderData || !senderData.experience_years) return '';
    return ` (${senderData.experience_years} years experience)`;
  };

  // Get the name of the other party in the trial
  const getOtherPartyName = (trial) => {
    if (role === 'player') {
      return trial.team_name || 'Unknown Team';
    } else if (role === 'team') {
      return trial.player_name || 'Unknown Player';
    } else if (role === 'scout') {
      // For scouts, show both player and team
      return `${trial.player_name || 'Unknown Player'} → ${trial.team_name || 'Unknown Team'}`;
    }
    return 'Unknown';
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString || 'Date not specified';
    }
  };

  // Get badge color based on trial status
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'declined': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  // Navigate to profile based on trial and current user role
  const handleViewProfile = (trial) => {
    if (role === 'player') {
      // Player viewing team profile
      if (trial.team_id) {
        navigate(`/team/profile/${trial.team_id}`);
      }
    } else if (role === 'team') {
      // Team viewing player profile - always use player_id for PlayerProfile
      navigate(`/player/profile/${trial.player_id}`);
    } else if (role === 'scout') {
      // Scout can view both team and player profiles
      // Default to player profile - always use player_id for PlayerProfile
      navigate(`/player/profile/${trial.player_id}`);
    }
  };
  
  // Check if user can update the status based on role and sender
  const canUpdateStatus = (trial) => {
    if (role === 'player' && trial.sender_role === 'team') {
      return trial.status === 'pending';
    }
    if (role === 'team' && (trial.sender_role === 'player' || trial.sender_role === 'scout')) {
      return trial.status === 'pending';
    }
    return false;
  };

  if (loading) {
    return (
      <div className="trials-loading">
        <div className="loading-spinner"></div>
        Loading trial invitations...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="trials-error">
        <p>{error}</p>
      </div>
    );
  }
  
  // Don't render anything if there are no trials
  if (!trials.length) {
    return null;
  }
  
  return (
    <div className="trials-list-container">
      <h5 className="trials-heading">
        <Calendar size={20} />
        Your Trial Invitations ({trials.length})
      </h5>
      
      <div className="trials-list">
        {trials.map(trial => (
          <div key={trial.id} className="trial-card">
            {/* Trial Header with Sender Info */}
            <div className="trial-header">
              <div className="trial-sender">
                <span>Trial sent by: </span>
                <span style={{color: '#3498db', fontWeight: '500'}}>
                  {getSenderName(trial)}{getSenderExperience(trial)} ({trial.sender_role})
                </span>
              </div>
            </div>

            {/* Player Info Section */}
            <div className="trial-player-info">
              <img 
                src={trial.player_photo || '/default-player.jpg'} 
                alt={getOtherPartyName(trial)}
                className="player-avatar"
                onError={(e) => {
                  e.target.src = '/default-player.jpg';
                }}
              />
              <div className="player-details">
                <div className="player-name">{getOtherPartyName(trial)}</div>
                <div className="player-meta">Age: {trial.player_age || 'N/A'}</div>
                <div className="player-meta">{trial.player_position || 'Position'}</div>
                <div className="player-meta">{trial.player_club || trial.team_name}</div>
                <div className="player-meta">{trial.player_nationality || 'Country'}</div>
              </div>
              <button 
                className="view-profile-btn"
                onClick={() => handleViewProfile(trial)}
              >
                VIEW PROFILE
              </button>
            </div>

            {/* Team and Date Info */}
            <div className="trial-details">
              <div className="team-info">
                <span>→ TO: </span>
                <span className="team-name">
                  {role === 'player' ? trial.team_name : 'N/A'}
                  {role === 'team' && ' (Team)'}
                </span>
              </div>
              <div className="trial-date-status">
                <div className="trial-date">
                  📅 {formatDate(trial.trial_date)}
                </div>
                <span className={`status-badge ${trial.status}`}>
                  {trial.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Trial Message */}
            {trial.invitation_message && (
              <div className="trial-message">
                {trial.invitation_message}
              </div>
            )}

            {/* Action Buttons for Pending Trials */}
            {canUpdateStatus(trial) && (
              <div className="trial-actions">
                <button
                  className="action-btn decline"
                  disabled={actionLoading[trial.id]}
                  onClick={() => handleTrialStatusUpdate(trial.id, 'declined')}
                >
                  <XSquare size={16} />
                  Decline
                </button>
                <button
                  className="action-btn accept"
                  disabled={actionLoading[trial.id]}
                  onClick={() => handleTrialStatusUpdate(trial.id, 'accepted')}
                >
                  <CheckSquare size={16} />
                  Accept
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrialInvitationsList;