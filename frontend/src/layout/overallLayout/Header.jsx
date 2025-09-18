import Logo from "../../assets/Logo";
import "./Header.css";
import { FaCog } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"
import {http} from "../../api/http"


export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout} = useAuth(); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <header className="header">
      <div className="logo-section">
        <Logo />
      </div>

      <div className="right-section">
        <span className="app-name">ProScout</span>
        <div className="settings-container" ref={menuRef}>
          <FaCog
            size={25}
            className="settings-icon"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <div className="dropdown-menu">
              <div onClick={() => alert("Edit Profile")}>✏️ Edit Profile</div>
              <div onClick={handleLogout}>🚪 Logout</div>
              <div onClick={handleDeleteAccount}>🗑️ Delete Account</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
