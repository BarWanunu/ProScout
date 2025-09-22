// src/features/trials/TrialCreateForm.jsx
import React, { useState } from "react";
import trialService from "@/api/services/trialService";
import { getToken } from "@/api/tokenStore";

export default function TrialCreateForm({ teamId, onCreated }) {
  const [playerId, setPlayerId] = useState("");
  const [trialDate, setTrialDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getToken();

      const data = {
        player_id: parseInt(playerId, 10),
        team_id: teamId, // חובה אם הקבוצה השולחת
        invitation_message: message,
        trial_date: trialDate,
      };

      const response = await trialService.createTrial(data, token);
      console.log("✅ Trial created:", response);

      if (onCreated) onCreated(); // ריענון הרשימה
      setPlayerId("");
      setTrialDate("");
      setMessage("");
    } catch (err) {
      console.error("❌ Failed to create trial:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
      <h4>Create Trial Invitation</h4>

      <div style={{ marginBottom: "10px" }}>
        <label>Player ID: </label>
        <input
          type="number"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Trial Date: </label>
        <input
          type="date"
          value={trialDate}
          onChange={(e) => setTrialDate(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Message: </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Trial"}
      </button>
    </form>
  );
}
