import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import "@/components/search/styles/SearchBox.css";

const DirectScoutSearch = ({ filters, setFilters, onSearch }) => {
  const [nationality, setNationality] = useState(filters?.nationality || '');
  const [minExperienceYears, setMinExperienceYears] = useState(filters?.min_experience_years || '');
  const [maxExperienceYears, setMaxExperienceYears] = useState(filters?.max_experience_years || '');
  
  // Update local state when filters prop changes
  useEffect(() => {
    setNationality(filters?.nationality || '');
    setMinExperienceYears(filters?.min_experience_years || '');
    setMaxExperienceYears(filters?.max_experience_years || '');
  }, [filters]);
  
  // Update parent filters when local state changes
  useEffect(() => {
    const newFilters = {
      nationality: nationality || undefined,
      min_experience_years: minExperienceYears ? parseInt(minExperienceYears, 10) : undefined,
      max_experience_years: maxExperienceYears ? parseInt(maxExperienceYears, 10) : undefined
    };
    
    setFilters(newFilters);
  }, [nationality, minExperienceYears, maxExperienceYears, setFilters]);
  
  // Handle form submission when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      onSearch();
    }
  };

  return (
    <div className="advanced-search-panel scout-search direct-scout-search">
      <div className="advanced-panel">
        <Form onKeyDown={handleKeyDown}>
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
        </Form>
      </div>
    </div>
  );
};

export default DirectScoutSearch;