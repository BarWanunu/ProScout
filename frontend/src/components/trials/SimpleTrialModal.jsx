import { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Calendar, MessageSquare, Send, User } from 'lucide-react';
import trialService from '@/api/services/trialService';
import { getToken } from '@/api/tokenStore';

const SimpleTrialModal = ({ 
  show, 
  onHide, 
  teamId,
  teamName,
  playerId,
  playerName,
  scoutId,
  onTrialCreated
}) => {
  const [formData, setFormData] = useState({
    trialDate: '',
    invitationMessage: '',
    timeSlot: '10:00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setFormData({
        trialDate: '',
        invitationMessage: '',
        timeSlot: '10:00'
      });
      setError('');
      
      // Scroll to top when modal opens
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [show, teamId, playerId]);

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

    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      
      // Combine date and time
      const trialDateTime = `${formData.trialDate}T${formData.timeSlot}:00.000Z`;
      
      // Build trial data
      const trialData = {
        player_id: parseInt(playerId, 10),
        team_id: parseInt(teamId, 10),
        scout_id: parseInt(scoutId, 10),
        invitation_message: formData.invitationMessage.trim(),
        trial_date: trialDateTime,
        sender_role: 'scout'
      };
      const response = await trialService.createTrial(trialData, token);
      // Reset form
      setFormData({
        trialDate: '',
        invitationMessage: '',
        timeSlot: '10:00'
      });
      
      // Notify parent and close
      if (onTrialCreated) {
        await onTrialCreated();
      }
      
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
      backdrop="static"
      keyboard={true}
      centered={true}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Send size={20} className="me-2" />
          Send Trial Invitation
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Player and Team Info */}
        <div className="mb-4 p-3 bg-light rounded">
          <div className="d-flex align-items-center">
            <User size={20} className="me-2 text-primary" />
            <div>
              <strong>Inviting Player to Trial</strong>
              <div className="text-muted">
                {playerName} → {teamName}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Trial Date */}
          <Form.Group className="mb-3">
            <Form.Label>
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
            <Form.Label>Time Slot</Form.Label>
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
            <Form.Label>
              <MessageSquare size={16} className="me-2" />
              Trial Message *
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.invitationMessage}
              onChange={(e) => handleInputChange('invitationMessage', e.target.value)}
              placeholder={`Invite ${playerName} to a trial with ${teamName}. Provide details about the trial...`}
              maxLength={500}
              disabled={loading}
            />
            <Form.Text className="text-muted">
              {formData.invitationMessage.length}/500 characters
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading || !formData.trialDate || !formData.invitationMessage.trim()}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Sending Invitation...
            </>
          ) : (
            <>
              <Send size={16} className="me-2" />
              Send Trial Invitation
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SimpleTrialModal;