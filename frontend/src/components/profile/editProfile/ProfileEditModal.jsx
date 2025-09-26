import { useAuth } from '../../../auth/AuthContext';
import PlayerProfileEdit from './PlayerProfileEdit';
import ScoutProfileEdit from './ScoutProfileEdit';
import TeamProfileEdit from './TeamProfileEdit';

export default function ProfileEditModal({ isOpen, onClose, onSuccess }) {
  const { role } = useAuth();

  // פונקציה לטיפול בעדכון מוצלח
  const handleSuccess = () => {
    // קריאה לפונקציה שהתקבלה מההורה (אם קיימת)
    if (onSuccess) {
      onSuccess();
    }
    
    // רענון הדף כדי לעדכן את הנתונים
    window.location.reload();
  };

  if (!isOpen) return null;

  const renderProfileEditor = () => {
    if (!role) {
      return (
        <div className="profile-edit-overlay">
          <div className="profile-edit-modal">
            <div className="modal-header">
              <h2>Error</h2>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Please log in to edit your profile.</p>
            </div>
          </div>
        </div>
      );
    }

    switch (role) {
      case 'player':
        return (
          <PlayerProfileEdit 
            onClose={onClose} 
            onSuccess={handleSuccess} 
          />
        );
      
      case 'scout':
        return (
          <ScoutProfileEdit 
            onClose={onClose} 
            onSuccess={handleSuccess} 
          />
        );
      
      case 'team':
        return (
          <TeamProfileEdit 
            onClose={onClose} 
            onSuccess={handleSuccess} 
          />
        );
      
      default:
        return (
          <div className="profile-edit-overlay">
            <div className="profile-edit-modal">
              <div className="modal-header">
                <h2>Error</h2>
                <button className="close-btn" onClick={onClose}>✕</button>
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Unknown user role: {role}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderProfileEditor();
}