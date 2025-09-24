import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Spinner } from 'react-bootstrap';
import { Calendar, CheckSquare, XSquare, User, Building } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import trialService from '@/api/services/trialService';
import { getToken } from '@/api/tokenStore';
import './TrialInvitationsList.css';

/**
 * Component to display trial invitations at the top of the page
 * Similar to how shortlisted players are displayed
 */
const TrialInvitationsList = ({ onRefresh, skipInitialFetch = false }) => {
  const { id, role } = useAuth();
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(!skipInitialFetch);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [hasInitialFetch, setHasInitialFetch] = useState(!skipInitialFetch);

  // Fetch trials on component mount and when refresh is triggered
  useEffect(() => {
    // Don't fetch on initial render if skipInitialFetch is true
    if (skipInitialFetch && !hasInitialFetch) {
      console.log('TrialInvitationsList: Skipping initial fetch');
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
    
    console.log('TrialInvitationsList: Fetching trials for', { role, id });
    fetchTrials();
  }, [id, role, onRefresh, hasInitialFetch]);

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
      
      console.log('TrialInvitationsList: Fetching trials with', { role, id });
      let response;
      
      // Get trials based on user role
      if (role === 'player') {
        response = await trialService.getTrialsByPlayer(id, token);
      } else if (role === 'team') {
        response = await trialService.getTrialsByTeam(id, token);
      } else if (role === 'scout') {
        response = await trialService.getTrialsByScout(id, token);
      } else {
        console.warn(`TrialInvitationsList: Unsupported role: ${role}`);
        setTrials([]);
        return;
      }
      
      console.log('TrialInvitationsList: API response:', response);
      
      if (response?.trials) {
        // Sort trials by date (most recent first) and status (pending first)
        const sortedTrials = response.trials.sort((a, b) => {
          // First sort by status (pending first)
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          
          // Then sort by date (newer first)
          return new Date(b.trial_date) - new Date(a.trial_date);
        });
        
        console.log(`TrialInvitationsList: Found ${sortedTrials.length} trials`);
        setTrials(sortedTrials);
      } else {
        console.log('TrialInvitationsList: No trials found in response');
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
      <div className="trials-loading text-center p-3">
        <Spinner animation="border" size="sm" /> Loading trial invitations...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="trials-error text-center p-2">
        <p className="text-danger mb-0">{error}</p>
      </div>
    );
  }
  
  // Don't render anything if there are no trials
  if (!trials.length) {
    return null;
  }
  
  return (
    <div className="trials-list-container mb-4">
      <h5 className="trials-heading">
        <Calendar size={20} className="me-2" />
        Your Trial Invitations ({trials.length})
      </h5>
      
      <div className="trials-list">
        {trials.map(trial => (
          <Card key={trial.id} className="trial-card mb-2">
            <Card.Body className="p-2">
              <div className="d-flex align-items-center justify-content-between">
                <div className="trial-info d-flex align-items-center">
                  {role === 'team' ? (
                    <User size={20} className="me-2 text-primary" />
                  ) : (
                    <Building size={20} className="me-2 text-primary" />
                  )}
                  
                  <div>
                    <div className="fw-bold">{getOtherPartyName(trial)}</div>
                    <div className="text-muted small">
                      <Calendar size={14} className="me-1" />
                      {formatDate(trial.trial_date)}
                    </div>
                  </div>
                </div>
                
                <div className="trial-actions d-flex align-items-center">
                  <Badge bg={getStatusBadgeVariant(trial.status)} className="me-2">
                    {trial.status.charAt(0).toUpperCase() + trial.status.slice(1)}
                  </Badge>
                  
                  {canUpdateStatus(trial) && (
                    <div className="action-buttons">
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-1"
                        disabled={actionLoading[trial.id]}
                        onClick={() => handleTrialStatusUpdate(trial.id, 'accepted')}
                      >
                        <CheckSquare size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        disabled={actionLoading[trial.id]}
                        onClick={() => handleTrialStatusUpdate(trial.id, 'declined')}
                      >
                        <XSquare size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrialInvitationsList;