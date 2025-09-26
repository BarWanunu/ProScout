import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '@/auth/AuthContext';
import TrialsManager from '@/components/trials/TrialsManager';
import trialService from '@/api/services/trialService';
import { getToken } from '@/api/tokenStore';

const PlayerTrialsTab = ({ player }) => {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id: currentUserId } = useAuth();

  // Load player trials
  const loadTrials = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      
      // Get trials for the current player using user_id
      const response = await trialService.getTrialsByPlayer(currentUserId, token);
      
      console.log('Player trials loaded:', response);
      
      if (response.trials) {
        setTrials(response.trials);
      } else {
        setTrials([]);
      }
    } catch (error) {
      console.error('Error loading player trials:', error);
      setError('Failed to load trial invitations. Please try again.');
      setTrials([]);
    } finally {
      setLoading(false);
    }
  };

  // Load trials when component mounts
  useEffect(() => {
    if (currentUserId) {
      loadTrials();
    }
  }, [currentUserId]);

  // Handle trial update (accept/decline/delete)
  const handleTrialUpdate = async () => {
    await loadTrials(); // Reload trials after any update
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading trials...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
        <div className="mt-2">
            {trials && trials.length > 0 && (
              <div className="trials-header mb-3">
                <h4 className="text-white">Trial Invitations</h4>
                <p className="text-muted mb-0">
                  Manage your trial invitations from teams. You can accept or decline invitations here.
                </p>
              </div>
            )}
        </div>
      </Alert>
    );
  }

  return (
    <div className="player-trials-tab">
      <div className="trials-header mb-3">
        <p className="text-muted mb-0">
          Manage your trial invitations from teams. You can accept or decline invitations here.
        </p>
      </div>
      <TrialsManager 
        trials={trials}
        userRole="player"
        onTrialUpdate={handleTrialUpdate}
        showActions={true}
      />
    </div>
  );
};

export default PlayerTrialsTab;