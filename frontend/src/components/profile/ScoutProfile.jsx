import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft, User, Phone, Globe, Award, Calendar } from 'lucide-react';
import scoutService from '@/api/services/scoutService';
import './ScoutProfile.css';

export default function ScoutProfile({ scoutId, onBack }) {
  const [scout, setScout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getScoutImage = (scout) => {
    const image = scout?.image;
    if (!image) return '/assets/default-player.png';
    if (typeof image === 'string' && image.startsWith('http')) return image;
    // If image looks like an upload path, prefix with server origin
    return `http://localhost:3000${image.startsWith('/') ? image : `/${image}`}`;
  };

  useEffect(() => {
    fetchScoutProfile();
  }, [scoutId]);

  const fetchScoutProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching scout profile for ID:', scoutId);
      const response = await scoutService.getScoutByScoutId(scoutId);
      console.log('Scout profile response:', response);
      // Accept responses that return { scout: {...} } even without a success flag
      if (response && response.scout) {
        setScout(response.scout);
      } else if (response.success) {
        setScout(response.scout);
      } else {
        console.error('Scout profile fetch returned unexpected shape:', response);
        setError('Scout with this ID does not exist');
      }
    } catch (err) {
      console.error('Error loading scout profile:', err);
      if (err.response && err.response.status === 404) {
        setError('Scout with this ID does not exist');
      } else {
        setError('Error loading scout profile');
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
            <ArrowLeft size={30} className="me-2" />
            Back
          </Button>
        </div>
      </Container>
    );
  }

  if (!scout) {
    return (
      <Container className="mt-4">
        <Alert variant="warning" className="text-center">
          Scout with this ID does not exist
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
    <Container className="scout-profile-container mt-4 position-relative">
      {/* Compact back button - top-left */}
      <button
        type="button"
        className="sp-back-btn"
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

      {/* Scout Profile Card */}
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="scout-profile-card shadow">
            <Card.Body className="p-4">
              {/* Profile Header */}
              <div className="profile-header text-center mb-4">
                <div className="profile-image-container mb-3">
                  {scout.image ? (
                    <img 
                      src={getScoutImage(scout)}
                      alt={`${scout.first_name} ${scout.last_name}`}
                      className="profile-image scout-image-square"
                      onError={(e) => { e.currentTarget.src = '/assets/default-player.png'; }}
                    />
                  ) : (
                    <div className="profile-placeholder scout-image-square">
                      <User size={40} className="text-muted" />
                    </div>
                  )}
                </div>
                <h2 className="profile-name mb-1">
                  {scout.first_name} {scout.last_name}
                </h2>
                <Badge bg="primary" className="role-badge">Scout</Badge>
                <p className="profile-subtitle mt-3 mb-0">
                  Hello, this is {scout.first_name} {scout.last_name}'s profile. Here is everything to know about me.
                </p>
              </div>

              {/* Profile Details */}
              <div className="profile-details">
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{scout.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Nationality</span>
                        <span className="info-value">{scout.nationality || 'Not provided'}</span>
                      </div>
                    </div>
                  </Col>

                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Experience</span>
                        <span className="info-value">
                          {scout.experience_years ? `${scout.experience_years} years` : 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </Col>

                  <Col md={6} className="mb-3">
                    <div className="info-item">
                      <div className="info-content">
                        <span className="info-label">Member Since</span>
                        <span className="info-value">
                          {scout.created_at ? 
                            new Date(scout.created_at).toLocaleDateString() : 
                            'Unknown'
                          }
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}