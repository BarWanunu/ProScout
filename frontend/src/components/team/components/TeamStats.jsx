import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Trophy, Users, MapPin, Flag, Award } from 'lucide-react';
import '../styles/TeamStats.css';

export default function TeamStats({ team }) {
  if (!team) return null;
  
  return (
    <div className="team-stats-container">
      <h5 className="stats-heading">Team Overview</h5>
      
      {/* Top Stats Cards */}
      <Row className="g-3">
        <Col md={3}>
          <Card className="team-stat-card">
            <Card.Body>
              <div className="team-stat-icon">
                <Trophy size={20} />
              </div>
              <div className="team-stat-content">
                <h6>Trophies</h6>
                <div className="team-stat-value">{team.trophies || '0'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="team-stat-card">
            <Card.Body>
              <div className="team-stat-icon">
                <Users size={20} />
              </div>
              <div className="team-stat-content">
                <h6>Formation</h6>
                <div className="team-stat-value">{team.formation || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="team-stat-card">
            <Card.Body>
              <div className="team-stat-icon">
                <Flag size={20} />
              </div>
              <div className="team-stat-content">
                <h6>Country</h6>
                <div className="team-stat-value">{team.country || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="team-stat-card">
            <Card.Body>
              <div className="team-stat-icon">
                <Award size={20} />
              </div>
              <div className="team-stat-content">
                <h6>League</h6>
                <div className="team-stat-value">{team.league || 'N/A'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Stadium Info */}
      <Row className="mt-3">
        <Col>
          <Card className="team-info-card">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <div className="team-stat-icon me-3">
                  <MapPin size={20} />
                </div>
                <h6 className="mb-0">Stadium Information</h6>
              </div>
              
              <div className="stadium-details mt-3">
                <div className="stadium-name">{team.stadium || 'Home Stadium'}</div>
                <div className="stadium-location">{team.country}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}