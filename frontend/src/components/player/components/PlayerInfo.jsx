import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { User, Hash, MapPin, Flag, Calendar, Ruler, Weight, Target } from 'lucide-react';
import '../styles/PlayerInfo.css';

export default function PlayerInfo({ player }) {
  if (!player) return null;
  
  // Format birthdate
  const formatBirthdate = (birthdate) => {
    if (!birthdate) return 'N/A';
    return new Date(birthdate).toLocaleDateString('en-GB');
  };
  
  return (
    <div className="player-info-container">
      <h5 className="info-heading">Player Overview</h5>
      
      {/* Top Info Cards */}
      <Row className="g-3">
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <Calendar size={20} />
              </div>
              <div className="player-info-content">
                <h6>Age</h6>
                <div className="player-info-value">{player.age || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <User size={20} />
              </div>
              <div className="player-info-content">
                <h6>Club</h6>
                <div className="player-info-value">{player.club || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <Hash size={20} />
              </div>
              <div className="player-info-content">
                <h6>Number</h6>
                <div className="player-info-value">{player.number || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <Target size={20} />
              </div>
              <div className="player-info-content">
                <h6>Position</h6>
                <div className="player-info-value">{player.position || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Second Row */}
      <Row className="g-3 mt-2">
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <Flag size={20} />
              </div>
              <div className="player-info-content">
                <h6>Nationality</h6>
                <div className="player-info-value">{player.nationality || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <Ruler size={20} />
              </div>
              <div className="player-info-content">
                <h6>Height</h6>
                <div className="player-info-value">{player.height || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <Weight size={20} />
              </div>
              <div className="player-info-content">
                <h6>Weight</h6>
                <div className="player-info-value">{player.weight || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="player-info-card">
            <Card.Body>
              <div className="player-info-icon">
                <Calendar size={20} />
              </div>
              <div className="player-info-content">
                <h6>Birth Date</h6>
                <div className="player-info-value">{formatBirthdate(player.birthdate)}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}