import { Logo } from "../../assets";
import "./Header.css";
import { FaCog } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="header">
      <div className="logo-section">
        <Logo />
      </div>

      <div className="right-section">
        <span className="app-name">ProScout</span>
        <div className="settings-container">
          <FaCog
            size={25}
            className="settings-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="dropdown-menu">
              <div onClick={() => alert("Edit Profile")}>✏️ Edit Profile</div>
              <div onClick={() => alert("Logout")}>🚪 Logout</div>
              <div onClick={() => alert("Delete Account")}>🗑️ Delete Account</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
