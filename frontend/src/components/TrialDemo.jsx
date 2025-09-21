// src/features/trials/TrialDemoTeam.jsx
import React, { useEffect, useState, useCallback } from "react";
import trialService from "@/api/services/trialService";
import teamService from "@/api/services/teamService";
import { useAuth } from "@/auth/AuthContext";
import TrialCreateForm from "./TrialCreation";

export default function TrialDemoTeam() {
  const { role, id: userId, token } = useAuth();
  const [teamId, setTeamId] = useState(null);
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(false);

  // שליפת teamId מהפרופיל
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (role === "team") {
          const response = await teamService.getTeamById(userId, token);
          setTeamId(response.team?.id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch team:", err);
      }
    };

    if (userId && token) fetchTeam();
  }, [role, userId, token]);

  // שליפת המבחנים
  const fetchTrials = useCallback(async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      const response = await trialService.getTrialsByTeam(teamId, token);
      console.log(response);
      setTrials(response.trials || response.data?.trials || []);
    } catch (err) {
      console.error("❌ Failed to fetch trials:", err);
    } finally {
      setLoading(false);
    }
  }, [teamId, token]);

  useEffect(() => {
    fetchTrials();
  }, [fetchTrials]);

  // מחיקה של מבחן
  const handleDelete = async (trialId) => {
    try {
      await trialService.deleteTrial(trialId, token);
      await fetchTrials(); // אחרי מחיקה שולפים מחדש
    } catch (err) {
      console.error("❌ Failed to delete trial:", err);
    }
  };

  return (
    <div>
        <TrialCreateForm teamId={teamId} onCreated={fetchTrials} />
      <h3>Trials for Team #{teamId}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : trials.length === 0 ? (
        <p>No trials found</p>
      ) : (
        <ul>
          {trials.map((trial) => (
            <li key={trial.id} style={{ marginBottom: "15px" }}>
              <b>Player #{trial.player_id}</b> invited by {trial.sender_role} <br />
              Message: {trial.invitation_message || "-"} <br />
              Date: {new Date(trial.trial_date).toLocaleDateString()} <br />
              Status: <b>{trial.status}</b> <br />
              {/* מחיקה רק אם ההזמנה נדחתה */}
              {trial.status === "declined" && (
                <button
                  style={{ color: "red", marginTop: "5px" }}
                  onClick={() => handleDelete(trial.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
