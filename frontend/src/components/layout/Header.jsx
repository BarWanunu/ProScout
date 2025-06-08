import { Logo } from "../../assets";
import "./Header.css";
import { FaCog } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // סגירה בלחיצה מחוץ לתפריט
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <div onClick={() => alert("Logout")}>🚪 Logout</div>
              <div onClick={() => alert("Delete Account")}>🗑️ Delete Account</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
