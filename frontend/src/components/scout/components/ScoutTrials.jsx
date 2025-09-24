import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { Calendar, MapPin, User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import trialService from "../../../api/services/trialService";
import playerService from "../../../api/services/playerService";
import teamService from "../../../api/services/teamService";
import { useAuth } from "../../../auth/AuthContext";
import "../styles/ScoutTrials.css";

export default function ScoutTrials({ scout }) {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerNames, setPlayerNames] = useState({});
  const [teamNames, setTeamNames] = useState({});
  const {token} = useAuth();

  useEffect(() => {
    const fetchTrials = async () => {
      if (!scout || !token) return;

      try {
        setLoading(true);
        const response = await trialService.getTrialsByScout(scout.id, token);
        console.log("Scout trials response:", response);
        const trialsData = response?.trials || [];
        setTrials(trialsData);

        // Fetch player and team names for all trials
        const playerIds = [...new Set(trialsData.map(trial => trial.player_id))];
        const teamIds = [...new Set(trialsData.map(trial => trial.team_id))];

        // Fetch player names
        const playerNamesMap = {};
        await Promise.all(
          playerIds.map(async (playerId) => {
            try {
              const playerData = await playerService.getPlayerName(playerId);
              playerNamesMap[playerId] = playerData.name;
            } catch (err) {
              console.error(`Failed to fetch player ${playerId} name:`, err);
              playerNamesMap[playerId] = "Player Name Unavailable";
            }
          })
        );

        // Fetch team names
        const teamNamesMap = {};
        await Promise.all(
          teamIds.map(async (teamId) => {
            try {
              const teamData = await teamService.getTeamName(teamId);
              teamNamesMap[teamId] = teamData.name;
            } catch (err) {
              console.error(`Failed to fetch team ${teamId} name:`, err);
              teamNamesMap[teamId] = "Team Name Unavailable";
            }
          })
        );

        setPlayerNames(playerNamesMap);
        setTeamNames(teamNamesMap);
      } catch (err) {
        console.error("Failed to fetch trials:", err);
        setError("Failed to load trial invitations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, [scout.id, token]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", text: "Pending", icon: <AlertCircle size={16} /> },
      accepted: { variant: "success", text: "Accepted", icon: <CheckCircle size={16} /> },
      declined: { variant: "danger", text: "Declined", icon: <XCircle size={16} /> },
      completed: { variant: "info", text: "Completed", icon: <CheckCircle size={16} /> },
    };

    const config = statusConfig[status] || statusConfig.pending;    

    return (
      <Badge bg={config.variant} className="status-badge d-flex align-items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="trials-loading">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading Trials Invitations</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="trials-error">
        {error}
      </Alert>
    );
  }

  // וידא שtrials הוא מערך
  const trialsArray = Array.isArray(trials) ? trials : [];

  if (trialsArray.length === 0) {
    return (
      <div className="trials-empty">
        <div className="empty-state">
          <Calendar size={64} className="empty-icon" />
          <h4>There aren't any trial invitations</h4>
          <p>You've yet to recommend a player for a trial</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scout-trials">
      <div className="trials-header">
        <h3 className="trials-title">
          <Calendar className="title-icon" />
          Trial Invitations You Recommended
        </h3>
        <Badge bg="primary" className="trials-count">
          {trialsArray.length} Invitations
        </Badge>
      </div>

      <div className="trials-grid">
        {trialsArray.map((trial) => (
          <Card key={trial.id} className="trial-card">
            <Card.Header className="trial-header">
              <div className="trial-status-wrapper">
                {getStatusBadge(trial.status)}
              </div>
              <div className="trial-date-wrapper">
                <Clock size={18} />
                <span>{formatDate(trial.trial_date)}</span>
              </div>
            </Card.Header>

            <Card.Body className="trial-body">
              <div className="trial-info">
                <div className="info-row">
                  <User size={18} className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Player:</span>
                    <span className="info-value">{playerNames[trial.player_id] || "Loading..."}</span>
                  </div>
                </div>

                <div className="info-row">
                  <MapPin size={18} className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Team:</span>
                    <span className="info-value">{teamNames[trial.team_id] || "Loading..."}</span>
                  </div>
                </div>

                {trial.invitation_message && (
                  <div className="trial-message-box">
                    <h6>Invitation Message:</h6>
                    <p>{trial.invitation_message}</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}