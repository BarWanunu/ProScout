import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Calendar, MessageSquare, Send, ArrowLeft, User } from 'lucide-react';
import trialService from '@/api/services/trialService';
import scoutService from '@/api/services/scoutService';
import playerService from '@/api/services/playerService';
import { getToken } from '@/api/tokenStore';
import { useAuth } from '@/auth/AuthContext';
import Header from '@/layout/overallLayout/Header';
import Footer from '@/layout/overallLayout/Footer';
import './styles/CreateTrialPage.css';

const CreateTrialPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: currentUserId, role, profile } = useAuth();
  
  // Get parameters from URL
  const playerId = searchParams.get('playerId');
  const playerName = decodeURIComponent(searchParams.get('playerName') || '');
   
  const teamId = searchParams.get('teamId');
  const teamName = decodeURIComponent(searchParams.get('teamName') || '');
  const urlScoutId = searchParams.get('scoutId');
  
  const [formData, setFormData] = useState({
    trialDate: '',
    invitationMessage: '',
    timeSlot: '10:00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentPlayerData, setCurrentPlayerData] = useState(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Load current player data if user is a player
    const loadCurrentPlayerData = async () => {
      if (role === 'player' && currentUserId) {
        try {
          const token = getToken();
          const playerData = await playerService.getPlayerById(currentUserId, token);
          setCurrentPlayerData(playerData);
        } catch (err) {
          console.error('Failed to load current player data:', err);
        }
      }
    };

    loadCurrentPlayerData();
  }, [role, currentUserId]);

  // Get tomorrow's date as minimum date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.trialDate || !formData.invitationMessage.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (role === 'player' && !currentUserId) {
      setError('User data is still loading. Please wait and try again.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      
      // Combine date and time
      const trialDateTime = `${formData.trialDate}T${formData.timeSlot}:00.000Z`;
      
      // Get the scout_id from the scout service if sender is scout
      let effectiveScoutId = null;
      
      if (role === 'scout') {
        try {
          // Use scoutId from URL if provided, otherwise use current user
          const userIdToLookup = urlScoutId ? parseInt(urlScoutId, 10) : parseInt(currentUserId, 10);
          console.log('🔍 Looking up scout with user_id:', userIdToLookup);
          
          const scoutData = await scoutService.getScoutById(userIdToLookup, token);
          effectiveScoutId = scoutData.id; // This is the scout_id from scouts table
          
          console.log('🎯 Scout lookup result:', {
            userIdLookedUp: userIdToLookup,
            scoutData,
            effectiveScoutId
          });
        } catch (scoutError) {
          console.error('❌ Failed to lookup scout:', scoutError);
          setError('Failed to lookup scout information. Please try again.');
          return;
        }
      }
      
      console.log('🔍 Scout ID debug info:', {
        urlScoutId,
        currentUserId,
        role,
        effectiveScoutId,
        'URL scout ID': urlScoutId,
        'Current user ID': currentUserId,
        'Effective scout ID (from scouts table)': effectiveScoutId
      });
      
      console.log('🔍 Current player data:', currentPlayerData);
      
      const trialData = {
        player_id: role === 'player' ? currentUserId : parseInt(playerId, 10),
        team_id: parseInt(teamId, 10),
        scout_id: effectiveScoutId, // Use scout_id instead of user_id
        invitation_message: formData.invitationMessage.trim(),
        trial_date: trialDateTime,
        sender_role: role
      };

      console.log('📤 Creating trial with data:', trialData);
      
      const response = await trialService.createTrial(trialData, token);
      
      console.log('✅ Trial created successfully:', response);
      
      setSuccess(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(`/${role}-dashboard`); // Go back to role-specific dashboard
      }, 2000);
      
    } catch (err) {
      console.error('❌ Failed to create trial:', err);
      setError(
        err.response?.data?.message || 
        'Failed to create trial invitation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    // Navigate to role-specific dashboard
    navigate(`/${role}-dashboard`);
  };

  if (success) {
    return (
      <div className="d-flex flex-column min-vh-100 create-trial-page">
        <Header />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center py-4">
          <Container>
            <div className="scout-container">
              <div className="success-container">
                <div className="success-icon">✅</div>
                <h3 className="success-title">{role === 'player' ? 'Trial Request Sent!' : 'Trial Invitation Sent!'}</h3>
                <p className="success-message">
                  Your {role === 'player' ? 'trial request' : 'trial invitation'} has been sent to <strong>{role === 'player' ? teamName : playerName}</strong> successfully.
                </p>
                <Button variant="primary" onClick={handleGoBack} className="px-4">
                  <ArrowLeft size={16} className="me-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 create-trial-page">
      <Header />
      <div className="flex-grow-1 py-4">
        <Container className="create-trial-container">
          <div className="scout-container">
            <div className="trial-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={handleGoBack} 
                    className="me-3 back-button"
                  >
                    <ArrowLeft size={16} className="me-1" />
                    Back
                  </Button>
                  <h4 className="mb-0 text-white d-flex align-items-center">
                    <Send size={20} className="me-2" />
                    {role === 'player' ? 'Request Trial' : 'Send Trial Invitation'}
                  </h4>
                </div>
              </div>
            </div>

            {/* Player and Team Info */}
            <div className="player-info-card">
              <div className="d-flex align-items-center">
                <User size={20} className="me-2 text-primary" />
                <div>
                  <strong>{role === 'player' ? 'Requesting Trial' : 'Inviting to Trial'}</strong>
                  <div className="team-info">
                    {currentPlayerData?.name || currentPlayerData?.first_name + ' ' + currentPlayerData?.last_name || 'Current Player'} → {teamName}
                  </div>
                </div>
              </div>
            </div>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="trial-form" id="trial-form">
            {/* Trial Date */}
            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                <Calendar size={16} className="me-2" />
                Trial Date *
              </Form.Label>
              <Form.Control
                type="date"
                value={formData.trialDate}
                onChange={(e) => handleInputChange('trialDate', e.target.value)}
                min={getTomorrowDate()}
                required
                disabled={loading}
              />
            </Form.Group>

            {/* Time Slot */}
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Time Slot</Form.Label>
              <Form.Select
                value={formData.timeSlot}
                onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                disabled={loading}
              >
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </Form.Select>
            </Form.Group>

            {/* Message */}
            <Form.Group className="mb-4">
              <Form.Label className="text-white">
                <MessageSquare size={16} className="me-2" />
                {role === 'player' ? 'Request Message *' : 'Trial Message *'}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.invitationMessage}
                onChange={(e) => handleInputChange('invitationMessage', e.target.value)}
                placeholder={role === 'player' 
                  ? `Request a trial with ${teamName}. Explain why you'd be a good fit for the team...` 
                  : `Invite ${playerName} to a trial with ${teamName}. Provide details about the trial...`
                }
                maxLength={500}
                disabled={loading}
              />
              <Form.Text>
                {formData.invitationMessage.length}/500 characters
              </Form.Text>
            </Form.Group>
          </Form>

          <div className="trial-actions-container">
            <div className="trial-actions">
              <Button 
                variant=""
                onClick={handleGoBack}
                disabled={loading}
                className="cancel-btn"
              >
                <span>Cancel</span>
              </Button>
              <Button 
                variant=""
                type="submit"
                form="trial-form"
                disabled={loading || !formData.trialDate || !formData.invitationMessage.trim()}
                className="send-btn"
              >
                {loading ? (
                  <span>
                    <Spinner size="sm" className="me-2" />
                    {role === 'player' ? 'Sending Request...' : 'Sending Invitation...'}
                  </span>
                ) : (
                  <span>
                    <Send size={16} className="me-2" />
                    {role === 'player' ? 'Send Trial Request' : 'Send Trial Invitation'}
                  </span>
                )}
              </Button>
            </div>
          </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default CreateTrialPage;