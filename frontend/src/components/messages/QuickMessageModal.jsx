import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Send, X } from 'lucide-react';
import messageService from '@/api/services/messageService';
import { getToken } from '@/api/tokenStore';

const QuickMessageModal = ({ show, onHide, recipientId, recipientName, recipientType = "User" }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      setSending(true);
      setError('');
      
      const token = getToken();
      const response = await messageService.sendMessage(
        recipientId,
        message.trim(),
        token
      );

      console.log('Message sent successfully:', response);
      setSuccess(true);
      setMessage('');
      
      // Close modal after short delay
      setTimeout(() => {
        setSuccess(false);
        onHide();
      }, 1500);

    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setError('');
    setSuccess(false);
    onHide();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      onEntered={() => {
        // Scroll to top when modal opens
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Send size={20} className="me-2" />
          Send Message to {recipientName || 'User'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {success ? (
          <Alert variant="success">
            <strong>Message sent successfully!</strong>
            <div className="mt-2 text-muted">
              Your message has been sent to {recipientName}
            </div>
          </Alert>
        ) : (
          <>
            <div className="mb-3">
              <strong>To:</strong> {recipientName || 'User'} ({recipientType})
            </div>
            
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                disabled={sending}
                autoFocus
              />
              <Form.Text className="text-muted">
                Press Enter to send, Shift+Enter for new line
              </Form.Text>
            </Form.Group>
          </>
        )}
      </Modal.Body>
      
      {!success && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={sending}>
            <X size={16} className="me-1" />
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSend} 
            disabled={sending || !message.trim()}
          >
            {sending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="me-1" />
                Send Message
              </>
            )}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default QuickMessageModal;