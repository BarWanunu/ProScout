import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Calendar, MessageSquare, Send, X, User } from 'lucide-react';
import trialService from '@/api/services/trialService';
import { getToken } from '@/api/tokenStore';
import './styles/TrialInvitationModal.css';

const TrialInvitationModal = ({ 
  show, 
  onHide, 
  // Target information
  targetType, 
  targetId,
  targetName,
  senderRole, 
  senderId,
  playerName, 
  playerId,   
  onTrialCreated,
  ...legacyProps
}) => {
  const [formData, setFormData] = useState({
    trialDate: '',
    invitationMessage: '',
    timeSlot: '10:00' // Default time
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalBodyRef = useRef(null);

  // Reset modal scroll position when modal opens and handle modal properties
  useEffect(() => {
    // Log modal properties to help debug
    if (show) {
      // Reset form data when modal opens
      setFormData({
        trialDate: '',
        invitationMessage: '',
        timeSlot: '10:00'
      });
      setError('');
      
      // Scroll document to middle-top area to show modal properly
      window.scrollTo({
        top: 550,
        left: 0,
        behavior: 'smooth'
      });
      
      // Improved scroll reset function with force redraw
      const resetScroll = () => {
        if (modalBodyRef.current) {
          // Force browser reflow/redraw
          void modalBodyRef.current.offsetHeight;
          
          // Comprehensive scroll reset using multiple methods
          modalBodyRef.current.scrollTop = 500;
          modalBodyRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Use instant instead of auto/smooth for more reliable reset
          });
          
          // Apply CSS transform trick to force redraw
          modalBodyRef.current.style.transform = 'translateZ(0)';
          void modalBodyRef.current.offsetHeight; // Force another reflow
          modalBodyRef.current.style.transform = '';
        }
        
        // Force window scroll to top again
        window.scrollTo(0, 0);
        
        // Force the modal to appear on top
        const modalElement = document.querySelector('.trial-invitation-modal');
        if (modalElement) {
          modalElement.style.zIndex = '9999';
        }
      };
      
      // Execute reset with progressive timeouts to catch various render timing issues
      resetScroll();
      setTimeout(resetScroll, 0);
      setTimeout(resetScroll, 50);
      setTimeout(resetScroll, 100);
      setTimeout(resetScroll, 250);
      setTimeout(resetScroll, 500);
    }
  }, [show, targetId, playerId]); // Add dependencies to re-run when these critical values change

  // Determine the scenario and setup dynamic content
  const getScenarioInfo = () => {
    // Log the current modal parameters for debugging
    // Backward compatibility - if old props are used
    if (playerId && !targetId) {
      return {
        scenario: 'team_to_player',
        title: 'Send Trial Invitation',
        targetDisplayName: playerName || `Player ${playerId}`,
        messageLabel: 'Invitation Message',
        placeholder: 'Write a personal message to the player about this trial opportunity...'
      };
    }

    // New generic approach
    const scenario = `${senderRole}_to_${targetType}`;
    const isForTrial = legacyProps.isForTrial;
    
    // Special case for scout recommending player to team or inviting player to trial with team
    if (scenario === 'scout_to_team' && playerId) {
      if (isForTrial) {
        // This is a trial invitation from scout for player to team
        return {
          scenario: 'scout_player_trial_to_team',
          title: 'Send Trial Invitation',
          targetDisplayName: targetName || `Team ${targetId}`,
          messageLabel: 'Trial Message',
          placeholder: `Invite ${playerName || 'this player'} to a trial with ${targetName}. Provide details about the trial...`
        };
      } else {
        // This is just a player recommendation to team (no trial)
        return {
          scenario: 'scout_to_team',
          title: 'Recommend Player to Team',
          targetDisplayName: targetName || `Team ${targetId}`,
          messageLabel: 'Recommendation Message',
          placeholder: `Recommend ${playerName || 'this player'} to the team. Explain why they would be a good fit...`
        };
      }
    }
    
    switch (scenario) {
      case 'team_to_player':
        return {
          scenario,
          title: 'Send Trial Invitation',
          targetDisplayName: targetName || `Player ${targetId}`,
          messageLabel: 'Invitation Message',
          placeholder: 'Write a personal message to the player about this trial opportunity...'
        };
      
      case 'scout_to_team': // This is handled above now
        return {
          scenario,
          title: 'Recommend Player to Team',
          targetDisplayName: targetName || `Team ${targetId}`,
          messageLabel: 'Recommendation Message',
          placeholder: `Recommend ${playerName || 'this player'} to the team. Explain why they would be a good fit...`
        };
      
      case 'scout_to_player':
        return {
          scenario,
          title: 'Send Trial Opportunity',
          targetDisplayName: targetName || `Player ${targetId}`,
          messageLabel: 'Opportunity Message',
          placeholder: 'Tell the player about this trial opportunity...'
        };
      
      case 'player_to_team':
        return {
          scenario,
          title: 'Request Trial',
          targetDisplayName: targetName || `Team ${targetId}`,
          messageLabel: 'Request Message',
          placeholder: 'Introduce yourself and explain why you want to join this team...'
        };
      
      default:
        return {
          scenario: 'unknown',
          title: 'Send Trial Invitation',
          targetDisplayName: targetName || 'Target',
          messageLabel: 'Message',
          placeholder: 'Write your message...'
        };
    }
  };

  const scenarioInfo = getScenarioInfo();

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
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.trialDate || !formData.invitationMessage.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      
      // Combine date and time properly - avoid timezone issues
      const trialDateTime = `${formData.trialDate}T${formData.timeSlot}:00.000Z`;
      
      // Build trial data based on scenario
      const trialData = {
        invitation_message: formData.invitationMessage.trim(),
        trial_date: trialDateTime,
        sender_role: senderRole,
      };

      // Add IDs based on scenario
      switch (scenarioInfo.scenario) {
        case 'team_to_player':
          trialData.player_id = parseInt(playerId || targetId, 10);
          trialData.team_id = parseInt(senderId, 10);
          break;
          
        case 'scout_to_team':
          trialData.player_id = parseInt(playerId, 10);
          trialData.team_id = parseInt(targetId, 10);
          trialData.scout_id = parseInt(senderId, 10);
          break;
          
        case 'scout_to_player':
          trialData.player_id = parseInt(targetId, 10);
          trialData.scout_id = parseInt(senderId, 10);
          break;
          
        case 'player_to_team':
          trialData.player_id = parseInt(senderId, 10);
          trialData.team_id = parseInt(targetId, 10);
          break;
          
        default:
          // Fallback to old logic for backward compatibility
          if (playerId) trialData.player_id = parseInt(playerId, 10);
          if (senderRole === 'team' && senderId) {
            trialData.team_id = parseInt(senderId, 10);
          } else if (senderRole === 'scout' && senderId) {
            trialData.scout_id = parseInt(senderId, 10);
          }
      }

      // Add metadata about the scenario
      const response = await trialService.createTrial(trialData, token);
      // Reset form
      setFormData({
        trialDate: '',
        invitationMessage: '',
        timeSlot: '10:00'
      });
      
      // Notify parent component
      if (onTrialCreated) {
        await onTrialCreated();
      }
      
      // Close modal
      onHide();
      
    } catch (err) {
      console.error('Failed to create trial:', err);
      setError(
        err.response?.data?.message || 
        'Failed to create trial invitation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        trialDate: '',
        invitationMessage: '',
        timeSlot: '10:00'
      });
      setError('');
      onHide();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      className="trial-invitation-modal"
      restoreFocus={false}
      autoFocus={false}
      backdrop="static" // Prevent closing when clicking outside
      keyboard={true} // Allow ESC key to close
      centered={true} // Center modal vertically
      animation={true} // Enable animation
      enforceFocus={true} // Force focus to stay inside modal
      onEntered={() => {
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTop = 0;
          modalBodyRef.current.scrollTo({ top: 0, behavior: 'instant' });
          
          // Force redraw
          modalBodyRef.current.style.transform = 'translateZ(0)';
          void modalBodyRef.current.offsetHeight;
          modalBodyRef.current.style.transform = '';
          
          // Force window scroll to top as well
          window.scrollTo(0, 0);
          
          // Force modal to be visible on top of everything
          const modalElement = document.querySelector('.trial-invitation-modal');
          if (modalElement) {
            modalElement.style.zIndex = '9999';
          }
        }
      }}
    >
      <Modal.Header className="trial-modal-header">
        <Modal.Title className="trial-modal-title">
          <Send size={20} className="me-2" />
          {scenarioInfo.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body 
        className="trial-modal-body" 
        ref={modalBodyRef}
        onAnimationEnd={() => {
          if (modalBodyRef.current) {
            modalBodyRef.current.scrollTop = 0;
            modalBodyRef.current.style.transform = 'translateZ(0)';
            void modalBodyRef.current.offsetHeight;
            modalBodyRef.current.style.transform = '';
          }
        }}
        onClick={() => {
          // Extra precaution to ensure scrollability on mobile devices
          if (modalBodyRef.current) {
            modalBodyRef.current.style.overflow = 'auto';
            modalBodyRef.current.style.webkitOverflowScrolling = 'touch';
          }
        }}
      >
        <div className="player-info-banner">
          <div className="player-banner-content">
            <User size={20} className="me-2" />
            <div>
              <strong>
                {scenarioInfo.scenario === 'scout_to_team' ? 'Recommending Player' :
                 scenarioInfo.scenario === 'player_to_team' ? 'Requesting Trial with' :
                 scenarioInfo.scenario === 'scout_to_player' ? 'Contacting Player' :
                 'Inviting Player'}
              </strong>
              <div className="player-name">
                {scenarioInfo.targetDisplayName}
                {scenarioInfo.scenario === 'scout_to_team' && playerName && (
                  <span className="text-muted"> • Player: {playerName}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="trial-error-alert">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Trial Date */}
          <Form.Group className="mb-3">
            <Form.Label className="trial-form-label">
              <Calendar size={16} className="me-2" />
              Trial Date *
            </Form.Label>
            <Form.Control
              type="date"
              value={formData.trialDate}
              onChange={(e) => handleInputChange('trialDate', e.target.value)}
              min={getTomorrowDate()}
              required
              className="trial-date-input"
              disabled={loading}
            />
          </Form.Group>

          {/* Time Slot */}
          <Form.Group className="mb-3">
            <Form.Label className="trial-form-label">
              Time Slot
            </Form.Label>
            <Form.Select
              value={formData.timeSlot}
              onChange={(e) => handleInputChange('timeSlot', e.target.value)}
              className="trial-time-input"
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
            <Form.Label className="trial-form-label">
              <MessageSquare size={16} className="me-2" />
              {scenarioInfo.messageLabel} *
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.invitationMessage}
              onChange={(e) => handleInputChange('invitationMessage', e.target.value)}
              placeholder={scenarioInfo.placeholder}
              maxLength={500}
              className="trial-message-input"
              disabled={loading}
            />
            <Form.Text className="text-muted">
              {formData.invitationMessage.length}/500 characters
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="trial-modal-footer">
        <Button 
          variant="secondary" 
          onClick={handleClose}
          disabled={loading}
          className="trial-cancel-btn"
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading || !formData.trialDate || !formData.invitationMessage.trim()}
          className="trial-send-btn"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              {scenarioInfo.scenario === 'scout_to_team' ? 'Recommending...' :
               scenarioInfo.scenario === 'player_to_team' ? 'Requesting...' :
               'Sending...'}
            </>
          ) : (
            <>
              <Send size={16} className="me-2" />
              {scenarioInfo.scenario === 'scout_to_team' ? 'Send Recommendation' :
               scenarioInfo.scenario === 'player_to_team' ? 'Request Trial' :
               scenarioInfo.scenario === 'scout_to_player' ? 'Send Opportunity' :
               'Send Invitation'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TrialInvitationModal;