import  { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import teamService from '@/api/services/teamService';
import defaultTeamImg from '@/assets/teamPhoto.jpg';
import './styles/TeamProfile.css';

export default function TeamProfile({ teamId, onBack }) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTeamLogo = (team) => {
    const logo = team?.logo;
    if (!logo) return defaultTeamImg;
    
    if (logo.startsWith('http')) {
      return logo;
    } else if (logo.startsWith('uploads/')) {
      return `${import.meta.env.VITE_API_BASE_URL}/${logo}`;
    } else {
      return `${import.meta.env.VITE_API_BASE_URL}/uploads/${logo}`;
    }
  };

  useEffect(() => {
    fetchTeamProfile();
  }, [teamId]);

  const fetchTeamProfile = async () => {
    try {
      setLoading(true);
      const response = await teamService.getTeamByTeamId(teamId);
      if (response && response.team) {
        setTeam(response.team);
      } else {
        console.error('Team profile fetch returned unexpected shape:', response);
        setError('Team with this ID does not exist');
      }
    } catch (err) {
      console.error('Error loading team profile:', err);
      if (err.response && err.response.status === 404) {
        setError('Team with this ID does not exist');
      } else {
        setError('Error loading team profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
        <div className="text-center">
          <Button variant="outline-primary" onClick={onBack}>
            <ArrowLeft size={16} className="me-2" />
            Back
          </Button>
        </div>
      </Container>
    );
  }

  if (!team) {
    return (
      <Container className="mt-4">
        <Alert variant="warning" className="text-center">
          Team with this ID does not exist
        </Alert>
        <div className="text-center">
          <Button variant="outline-primary" onClick={onBack}>
            <ArrowLeft size={16} className="me-2" />
            Back
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="team-profile-container mt-4 position-relative">
      {/* Compact back button - top-left */}
      <button
        type="button"
        className="tp-back-btn"
        onClick={onBack}
        aria-label="Back"
        title="Back"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>
      {/* Header with Back Button */}
      <Row className="mb-2">
        <Col>{/* spacing retained */}</Col>
      </Row>

      {/* Team Profile Card */}
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="team-profile-card shadow">
            <Card.Body className="p-4">
              {/* Profile Header */}
              <div className="profile-header text-center mb-4">
                <div className="profile-logo-container mb-3">
                  {team.logo ? (
                    <img 
                      src={getTeamLogo(team)}
                      alt={team.team_name}
                      className="profile-logo team-logo-square"
                      onError={(e) => { e.currentTarget.src = defaultTeamImg; }}
                    />
                  ) : (
                    <div className="profile-placeholder team-logo-square" />
                  )}
                </div>
                <h2 className="profile-name mb-1">
                  {team.team_name}
                </h2>
                <Badge bg="success" className="role-badge">Team</Badge>
                <p className="profile-subtitle mt-3 mb-0">
                  Hello, this is {team.team_name}'s profile. Here is everything to know about us.
                </p>
              </div>

              {/* Profile Details */}
              <div className="profile-details">
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">League</span>
                        <span className="info-value">{team.league || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Country</span>
                        <span className="info-value">{team.country || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Formation</span>
                        <span className="info-value">{team.formation || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Tropihes</span>
                        <span className="info-value">{team.trophies || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  {team.trophies && (
                    <Col xs={12} className="mb-3">
                      <div className="info-item">
                        <div className="info-content">
                          <span className="info-label">Stadium</span>
                          <span className="info-value">{team.stadium}</span>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}