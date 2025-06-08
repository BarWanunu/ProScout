import { useState } from "react";
import "../styles/PlayerSearchToggle.css";

export default function PlayerSearchToggle({ onModeChange }) {
  const [mode, setMode] = useState("profile");

  const toggleMode = () => {
    const newMode = mode === "profile" ? "stats" : "profile";
    setMode(newMode);
    onModeChange(newMode);
  };

  return (
    <div className="toggle-container">
      <span className={`toggle-label ${mode === "profile" ? "active" : ""}`}>By Profile</span>
      <div
        className={`toggle-switch ${mode === "stats" ? "active" : ""}`}
        onClick={toggleMode}
      >
        <div className="toggle-button" />
      </div>
      <span className={`toggle-label ${mode === "stats" ? "active" : ""}`}>By Stats</span>
    </div>
  );
}
