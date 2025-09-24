import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Star, Award, BarChart2 } from 'lucide-react';
import '../styles/RecommendationTab.css';

const RecommendationTab = ({ team }) => {
  // Mock data for recommendations - בפרוייקט אמיתי זה יגיע מהשרת
  const recommendedPlayers = [
    {
      id: 1,
      name: 'Alex Johnson',
      position: 'Forward',
      age: 22,
      club: 'Athletic FC',
      rating: 8.5,
      compatibilityScore: 94,
      image: 'https://images.unsplash.com/photo-1567303314286-6735a4ad9d42?q=80&w=100&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      position: 'Midfielder',
      age: 24,
      club: 'United SC',
      rating: 7.9,
      compatibilityScore: 88,
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'David Chen',
      position: 'Defender',
      age: 23,
      club: 'City FC',
      rating: 8.1,
      compatibilityScore: 86,
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&auto=format&fit=crop'
    },
  ];

  // אם אין שחקנים מומלצים או אין מספיק מידע
  if (!recommendedPlayers || recommendedPlayers.length === 0) {
    return (
      <Container className="py-4">
        <Card className="recommendation-empty text-center p-5">
          <h4 className="mb-3">No Recommendations Available</h4>
          <p>
            We need more information about your team's preferences and needs to generate personalized recommendations.
            Complete your team profile or shortlist more players to help our algorithm understand your requirements.
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <div className="recommendation-tab">
      <div className="recommendation-header">
        <h4>Player Recommendations</h4>
        <p>Players we think would be a perfect fit for {team?.team_name || 'your team'} based on your preferences and needs</p>
      </div>

      <Row className="recommendation-filters mb-4">
        <Col md={6}>
          <div className="filter-label">Showing recommendations based on:</div>
          <div className="filter-pills">
            <span className="filter-pill active">Team Formation</span>
            <span className="filter-pill active">Playing Style</span>
            <span className="filter-pill">Budget Range</span>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {recommendedPlayers.map((player) => (
          <Col md={6} lg={4} key={player.id}>
            <Card className="recommendation-card h-100">
              <div className="recommendation-score">
                <span>{player.compatibilityScore}%</span>
                <small>match</small>
              </div>
              
              <div className="recommendation-player-header">
                <img src={player.image} alt={player.name} className="player-image" />
                <div>
                  <h5 className="player-name">{player.name}</h5>
                  <div className="player-meta">
                    <span className="position">{player.position}</span>
                    <span className="age">{player.age} yrs</span>
                  </div>
                  <div className="player-club">{player.club}</div>
                </div>
              </div>

              <Card.Body>
                <div className="player-stats">
                  <div className="stat-item">
                    <div className="stat-icon"><Star size={16} /></div>
                    <div className="stat-label">Rating</div>
                    <div className="stat-value">{player.rating}</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon"><Award size={16} /></div>
                    <div className="stat-label">Strengths</div>
                    <div className="stat-value">Pace, Shooting</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon"><BarChart2 size={16} /></div>
                    <div className="stat-label">Fit Score</div>
                    <div className="stat-value high">{player.compatibilityScore}%</div>
                  </div>
                </div>
              </Card.Body>

              <Card.Footer>
                <button className="btn-view-profile">View Profile</button>
                <button className="btn-shortlist">Add to Shortlist</button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecommendationTab;