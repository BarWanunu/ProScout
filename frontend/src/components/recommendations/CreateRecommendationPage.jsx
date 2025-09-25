import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { ArrowLeft, Send, MessageSquare, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/auth/AuthContext";
import recommendationService from "@/api/services/recommendationService";
import scoutService from "@/api/services/scoutService";
import { getToken } from "@/api/tokenStore";
import "./CreateRecommendationPage.css";

const CreateRecommendationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: currentUserId } = useAuth();
  
  // State for form data
  const [formData, setFormData] = useState({
    recommendationNote: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [scoutId, setScoutId] = useState(null);

  // Extract parameters from URL
  const playerId = searchParams.get("playerId");
  const playerName = searchParams.get("playerName");
  const teamId = searchParams.get("teamId");
  const teamName = searchParams.get("teamName");

  // Fetch scout ID for current user
  useEffect(() => {
    const fetchScoutId = async () => {
      try {
        const token = getToken();
        const scoutData = await scoutService.getScoutByUserId(currentUserId, token);
        if (scoutData?.scout?.id) {
          setScoutId(scoutData.scout.id);
        }
      } catch (error) {
        console.error("Failed to fetch scout ID:", error);
        setError("Failed to load scout information");
      }
    };

    if (currentUserId) {
      fetchScoutId();
    }
  }, [currentUserId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!scoutId || !playerId || !teamId || !formData.recommendationNote.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      await recommendationService.createRecommendation({
        scout_id: scoutId,
        player_id: parseInt(playerId),
        teams_id: parseInt(teamId),
        recommendation_note: formData.recommendationNote.trim(),
      }, token);

      setSuccess(true);
    } catch (error) {
      console.error("Failed to create recommendation:", error);
      setError(error.response?.data?.message || "Failed to create recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Validation check
  if (!playerId || !playerName || !teamId || !teamName) {
    return (
      <div className="d-flex flex-column min-vh-100 create-recommendation-page">
        <Header />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Container>
            <Alert variant="danger" className="text-center">
              <h4>Missing Information</h4>
              <p>Required information is missing. Please go back and try again.</p>
              <Button variant="primary" onClick={handleGoBack}>
                <ArrowLeft size={16} className="me-2" />
                Go Back
              </Button>
            </Alert>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="d-flex flex-column min-vh-100 create-recommendation-page">
        <Header />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center py-4">
          <Container>
            <div className="scout-container">
              <div className="success-container">
                <div className="success-icon">✅</div>
                <h3 className="success-title">Recommendation Sent!</h3>
                <p className="success-message">
                  Your recommendation for <strong>{playerName}</strong> to <strong>{teamName}</strong> has been sent successfully.
                </p>
                <Button variant="primary" onClick={handleGoBack} className="px-4">
                  <ArrowLeft size={16} className="me-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 create-recommendation-page">
      <Header />
      <div className="flex-grow-1 py-4">
        <Container className="create-recommendation-container">
          <div className="scout-container">
            <div className="recommendation-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={handleGoBack} 
                    className="me-3 back-button"
                  >
                    <ArrowLeft size={16} className="me-1" />
                    Back
                  </Button>
                  <h4 className="mb-0 text-white d-flex align-items-center">
                    <Send size={20} className="me-2" />
                    Send Recommendation
                  </h4>
                </div>
              </div>
            </div>

            {/* Player and Team Info */}
            <div className="recommendation-info-card">
              <div className="info-row">
                <div className="info-section">
                  <h6 className="info-title">
                    <User size={16} className="me-2" />
                    Recommending Player
                  </h6>
                  <div className="info-content">
                    <strong>{playerName}</strong>
                  </div>
                </div>
                <div className="arrow-section">
                  <span className="recommendation-arrow">→</span>
                </div>
                <div className="info-section">
                  <h6 className="info-title">
                    To Team
                  </h6>
                  <div className="info-content">
                    <strong>{teamName}</strong>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="recommendation-form" id="recommendation-form">
              {/* Recommendation Note */}
              <Form.Group className="mb-4">
                <Form.Label className="text-white">
                  <MessageSquare size={16} className="me-2" />
                  Recommendation Note *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.recommendationNote}
                  onChange={(e) => handleInputChange('recommendationNote', e.target.value)}
                  placeholder={`Why do you recommend ${playerName} to ${teamName}? Describe their skills, strengths, and potential...`}
                  maxLength={500}
                  disabled={loading}
                />
                <Form.Text>
                  {formData.recommendationNote.length}/500 characters
                </Form.Text>
              </Form.Group>
            </Form>

            <div className="recommendation-actions-container">
              <div className="recommendation-actions">
                <Button 
                  variant=""
                  onClick={handleGoBack}
                  disabled={loading}
                  className="cancel-btn"
                >
                  <span>Cancel</span>
                </Button>
                <Button 
                  variant=""
                  type="submit"
                  form="recommendation-form"
                  disabled={loading || !formData.recommendationNote.trim()}
                  className="send-btn"
                >
                  {loading ? (
                    <span>
                      <Spinner size="sm" className="me-2" />
                      Sending Recommendation...
                    </span>
                  ) : (
                    <span>
                      <Send size={16} className="me-2" />
                      Send Recommendation
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default CreateRecommendationPage;