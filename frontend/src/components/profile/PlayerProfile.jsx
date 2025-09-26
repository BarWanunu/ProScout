import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { ArrowLeft, User, Calendar, MapPin, Activity } from 'lucide-react';
import playerService from '@/api/services/playerService';
import { getToken } from '@/api/tokenStore';
import PlayerStatsTab from '../player/components/PlayerStatsTab';
import PlayerHighlightsTab from '../player/components/PlayerHighlightsTab';
import './PlayerProfile.css';

const PlayerProfile = ({ userId, onBack, navigateToProfile }) => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('PlayerProfile props:', { userId, onBack });

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        console.log('Fetching player profile for ID:', userId);
        
        const result = await playerService.getPlayerFull(userId, token);
        console.log('Player profile response:', result);
        
        const playerData = result.player;
        if (!playerData) {
          throw new Error('Player data not found');
        }
        
        setPlayer(playerData);
      } catch (err) {
        console.error('Failed to fetch player profile:', err);
        if (err.response && err.response.status === 404) {
          setError('Player with this ID does not exist');
        } else if (err.message === 'Player data not found') {
          setError('Player with this ID does not exist');
        } else {
          setError('Failed to load player profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPlayerProfile();
    }
  }, [userId]);

  const getPlayerImage = (player) => {
    if (player?.photo) {
      if (player.photo.startsWith('http')) {
        return player.photo;
      }
      return `http://localhost:3000/uploads/players/${player.photo}`;
    }
    return '/assets/default-player.png';
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

  if (!player) {
    return (
      <Container className="mt-4">
        <Alert variant="warning" className="text-center">
          Player with this ID does not exist
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
    <Container className="player-profile-container mt-4 position-relative">
      {/* Compact back button - top-left */}
      <button
        type="button"
        className="pp-back-btn"
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

      {/* Player Profile Card */}
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="player-profile-card shadow">
            <Card.Body className="p-4">
              {/* Profile Header */}
              <div className="profile-header text-center mb-4">
                <div className="profile-image-container mb-3">
                  <img
                    src={getPlayerImage(player)}
                    alt={player.name || 'Player'}
                    className="profile-image player-image-square"
                    onError={(e) => {
                      e.target.src = '/assets/default-player.png';
                    }}
                  />
                </div>
                <h2 className="profile-name mb-1">
                  {player.name || 'Unknown Player'}
                </h2>
                <Badge bg="info" className="role-badge">Player</Badge>
                <p className="profile-subtitle mt-3 mb-0">
                  Hello, this is {player.name || 'Player'} profile. Here is everything to know about me. You can see here my stats and highlight video.
                </p>
              </div>

              {/* Profile Details */}
              <div className="profile-details">
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Position</span>
                        <span className="info-value">{player.position || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Age</span>
                        <span className="info-value">{player.age || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Nationality</span>
                        <span className="info-value">{player.nationality || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Height</span>
                        <span className="info-value">{player.height ? `${player.height}` : 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Weight</span>
                        <span className="info-value">{player.weight ? `${player.weight}` : 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Club</span>
                        <span className="info-value">{player.club || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Player Statistics Section */}
      <Row className="justify-content-center mt-4">
        <Col lg={8} md={10}>
          <Card className="player-profile-card shadow">
            <Card.Body className="p-4">
              <h3 className="section-title mb-4">
                Player Statistics
              </h3>
              <PlayerStatsTab player={player} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Player Highlights Section */}
      <Row className="justify-content-center mt-4">
        <Col lg={8} md={10}>
          <Card className="player-profile-card shadow">
            <Card.Body className="p-4">
              <h3 className="section-title mb-4">
                Highlight Video
              </h3>
              <PlayerHighlightsTab player={player} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerProfile;