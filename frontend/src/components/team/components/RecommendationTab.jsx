import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import RecommendationsManager from './RecommendationsManager';
import recommendationService from '@/api/services/recommendationService';
import { getToken } from '@/api/tokenStore';
import { useAuth } from '@/auth/AuthContext';

const RecommendationTab = ({ team }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchRecommendations = async () => {
    if (!team || !token) {
      console.log("Missing team or token:", { team, token });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching recommendations with token:", token);
      const response = await recommendationService.getRecommendationsByTeam(token);
      console.log("Team recommendations response:", response);
      console.log("Team data:", team);
      
      // The API returns the recommendations array directly or in a wrapper
      const recommendationsData = response?.recommendations || response || [];
      console.log("Processed recommendations data:", recommendationsData);
      setRecommendations(recommendationsData);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError("Failed to load recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [team?.id, token]);

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-light">Loading recommendations...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <RecommendationsManager 
        recommendations={recommendations}
        userRole="team"
        onRecommendationUpdate={fetchRecommendations}
        showActions={true}
      />
    </Container>
  );
};

export default RecommendationTab;