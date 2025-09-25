import React, { useState, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";
import trialService from "../../../api/services/trialService";
import { useAuth } from "../../../auth/AuthContext";
import TrialsManager from '@/components/shared/TrialsManager';
import '@/components/shared/TrialsManager.css';

export default function ScoutTrials({ scout }) {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchTrials = async () => {
    if (!scout || !token) return;

    try {
      setLoading(true);
      const response = await trialService.getTrialsByScout(scout.id, token);
      console.log("Scout trials response:", response);
      const trialsData = response?.trials || [];
      setTrials(trialsData);
    } catch (err) {
      console.error("Failed to fetch trials:", err);
      setError("Failed to load trial invitations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, [scout.id, token]);

  if (loading) {
    return (
      <div className="trials-loading">
        <div className="custom-spinner"></div>
        <p>Loading Trial Invitations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trials-manager">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <TrialsManager 
      trials={trials}
      userRole="scout"
      onTrialUpdate={fetchTrials}
      showActions={false} // Scouts can only view, no actions
    />
  );
}