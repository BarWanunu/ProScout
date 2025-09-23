import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import "@/components/search/SearchBox.css";

const AdvancedSearchScout = ({ name, onSearch, setNameFilter }) => {
  const [nationality, setNationality] = useState('');
  const [minExperienceYears, setMinExperienceYears] = useState('');
  const [maxExperienceYears, setMaxExperienceYears] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  const handleClearFilters = () => {
    setNationality('');
    setMinExperienceYears('');
    setMaxExperienceYears('');
  };

  const handleSearch = () => {
    // Construct filters object
    const filters = {
      name: name,
      nationality: nationality || undefined,
      min_experience_years: minExperienceYears ? parseInt(minExperienceYears, 10) : undefined,
      max_experience_years: maxExperienceYears ? parseInt(maxExperienceYears, 10) : undefined
    };

    // Call the parent's search function with our filters
    onSearch(filters);
  };

  return (
    <div className="advanced-search-panel scout-search">
      <div className="advanced-toggle" onClick={toggleAdvanced}>
        <span>{isAdvancedOpen ? 'Hide' : 'Show'} Advanced Search</span>
        <span className={`toggle-icon ${isAdvancedOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isAdvancedOpen && (
        <div className="advanced-panel">
          <Form.Group className="mb-3">
            <Form.Label>Search by Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name (regex search)"
              value={name}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <Form.Text className="text-muted">
              Search by first name, last name, or full name (regex-style matching)
            </Form.Text>
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Nationality</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Min Experience (years)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minExperienceYears}
                  onChange={(e) => setMinExperienceYears(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Max Experience (years)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxExperienceYears}
                  onChange={(e) => setMaxExperienceYears(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="advanced-buttons">
            <Button variant="outline-secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button variant="primary" onClick={handleSearch}>
              Search Scouts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchScout;