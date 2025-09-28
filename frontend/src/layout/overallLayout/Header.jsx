import Logo from "../../assets/Logo";
import "./Header.css";
import { FaCog } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"
import {http} from "../../api/http"
import { ProfileEditModal } from "../../components/profile";
import scoutService from "../../api/services/scoutService";
import playerService from "../../api/services/playerService";
import teamService from "../../api/services/teamService";

export default function Header({ profileId }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout, role, id, token } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // פתיחת עריכת פרופיל
  const handleEditProfile = () => {
    setShowMenu(false);
    setShowProfileEdit(true);
  };

  // סגירת עריכת פרופיל
  const handleCloseProfileEdit = () => {
    setShowProfileEdit(false);
  };

  // הצגת פרופיל עצמי
  const handleViewProfile = async () => {
    setShowMenu(false);
    if (role && id) {
      try {
        const token = localStorage.getItem('token');
        let entityId;
        
        switch(role) {
          case 'player':
            const playerData = await playerService.getPlayerById(id, token);
            entityId = playerData?.id;
            break;
          case 'scout':
            const scoutData = await scoutService.getScoutById(id, token);
            entityId = scoutData?.id;
            break;
          case 'team':
            const teamData = await teamService.getTeamById(id);
            entityId = teamData?.team?.id;
            break;
          default:
            console.error('Unknown role:', role);
            return;
        }
        
        if (entityId) {
          const profilePath = `/${role}/profile/${entityId}`;
          navigate(profilePath);
        } else {
          console.error('Could not find entity ID for user');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }
  };

  // הצלחה בעדכון פרופיל
  const handleProfileUpdateSuccess = () => {
    // אפשר להוסיף כאן רענון נתונים או הודעה
  };

  // התנתקות
  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  // מחיקת חשבון
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await http.delete("/user");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account", err);
      alert("Something went wrong while deleting your account.");
    }
  };

  // ניווט לפרופיל עצמי
  const handleViewProfile = () => {
    setShowMenu(false);
    
    if (!role) {
      console.error('❌ Cannot navigate - missing role');
      return;
    }

    if (profileId) {
      const profilePath = `/${role}/profile/${profileId}`;
      navigate(profilePath);
    } else {
      console.error('❌ Cannot navigate - missing profileId');
    }
  };

  return (
    <header className="header">
      <div className="logo-section">
        <Logo />
        <span className="app-name">ProScout</span>
      </div>

      <div className="right-section">
        <div className="settings-container" ref={menuRef}>
          <FaCog
            size={25}
            className="settings-icon"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <div className="dropdown-menu">
              <div onClick={handleViewProfile}>👤 View Profile</div>
              <div onClick={handleEditProfile}>✏️ Edit Profile</div>
              <div onClick={handleLogout}>🚪 Logout</div>
              <div onClick={handleDeleteAccount}>🗑️ Delete Account</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={showProfileEdit}
        onClose={handleCloseProfileEdit}
        onSuccess={handleProfileUpdateSuccess}
      />
    </header>
  );
}
