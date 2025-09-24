import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Calendar, MessageSquare, Send, X, User } from 'lucide-react';
import trialService from '@/api/services/trialService';
import { getToken } from '@/api/tokenStore';
import './TrialInvitationModal.css';

const TrialInvitationModal = ({ 
  show, 
  onHide, 
  playerId, 
  playerName, 
  onTrialCreated,
  senderRole = 'team', // 'scout', 'team', 'player'
  senderId = null // ID of the sender (team_id, scout_id, or player_id)
}) => {
  const [formData, setFormData] = useState({
    trialDate: '',
    invitationMessage: '',
    timeSlot: '10:00' // Default time
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      const trialData = {
        player_id: parseInt(playerId, 10),
        invitation_message: formData.invitationMessage.trim(),
        trial_date: trialDateTime,
        sender_role: senderRole, // Add sender role to the payload
      };

      // Add sender ID based on role
      if (senderRole === 'team' && senderId) {
        trialData.team_id = parseInt(senderId, 10);        
        
      } else if (senderRole === 'scout' && senderId) {
        trialData.scout_id = parseInt(senderId, 10);
      }

      console.log('Creating trial with data:', trialData);
      
      const response = await trialService.createTrial(trialData, token);
      
      console.log('✅ Trial created successfully:', response);
      
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
      console.error('❌ Failed to create trial:', err);
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
      centered
      className="trial-invitation-modal"
    >
      <Modal.Header className="trial-modal-header">
        <Modal.Title className="trial-modal-title">
          <Send size={20} className="me-2" />
          Send Trial Invitation
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="trial-modal-body">
        {playerName && (
          <div className="player-info-banner">
            <div className="player-banner-content">
              <User size={20} className="me-2" />
              <div>
                <strong>Inviting Player</strong>
                <div className="player-name">{playerName}</div>
              </div>
            </div>
          </div>
        )}

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

          {/* Invitation Message */}
          <Form.Group className="mb-4">
            <Form.Label className="trial-form-label">
              <MessageSquare size={16} className="me-2" />
              Invitation Message *
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.invitationMessage}
              onChange={(e) => handleInputChange('invitationMessage', e.target.value)}
              placeholder="Write a personal message to the player about this trial opportunity..."
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
              Sending...
            </>
          ) : (
            <>
              <Send size={16} className="me-2" />
              Send Invitation
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TrialInvitationModal;