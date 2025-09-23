import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import "@/components/search/styles/SearchBox.css";

const DirectTeamSearch = ({ league, setLeague, country, setCountry, formation, setFormation, onSearch }) => {
  const handleClearFilters = () => {
    setLeague('');
    setCountry('');
    setFormation('');
  };

  // Handle form submission when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      onSearch();
    }
  };

  return (
    <div className="advanced-search-panel team-search direct-team-search">
      <div className="advanced-panel">
        <Form onKeyDown={handleKeyDown}>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>League</Form.Label>
                <Form.Select
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                >
                  <option value="">Select League</option>
                  <option value="La Liga">La Liga</option>
                  <option value="Premier League">Premier League</option>
                  <option value="Ligue 1">Ligue 1</option>
                  <option value="Serie A">Serie A</option>
                  <option value="Bundesliga">Bundesliga</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Formation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 4-3-3"
                  value={formation}
                  onChange={(e) => setFormation(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default DirectTeamSearch;