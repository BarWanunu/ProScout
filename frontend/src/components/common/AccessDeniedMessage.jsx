import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './AccessDeniedMessage.css';

const AccessDeniedMessage = ({ show, allowedRoles, currentRole, onClose, autoCloseTime = 10 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(autoCloseTime);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setCountdown(autoCloseTime);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
  }, [show, autoCloseTime]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Wait for animation to complete
    }
  };

  const roleNames = {
    'player': 'player',
    'scout': 'scout', 
    'team': 'team'
  };

  if (!isVisible) return null;

  const allowedRoleNames = allowedRoles.map(r => roleNames[r] || r).join(' or ');
  const currentRoleName = roleNames[currentRole] || currentRole;

  return (
    <div className="access-denied-overlay">
      <div className="access-denied-message">
        <div className="message-header">
          <AlertTriangle size={24} className="warning-icon" />
          <h3>Access Denied</h3>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        <div className="message-body">
          <p>
            This page is available only for <strong>{allowedRoleNames}</strong>.
          </p>
          <p>
            You are connected as <strong>{currentRoleName}</strong>. You'll be directed to your dashboard now.
          </p>
          <p className="countdown-text">
           Automatic redirection in <strong>{countdown}</strong> seconds
        </p>
        </div>
        <div className="message-footer">
          <button className="ok-button" onClick={handleClose}>
             Return now ({countdown})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedMessage;