import { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Search, Building } from 'lucide-react';
import searchService from '@/api/services/searchService';
import { getToken } from '@/api/tokenStore';
import './styles/SelectModals.css';

/**
 * Modal component for selecting a team to recommend a player to
 */
const TeamSelectModal = ({ 
  show, 
  onHide,
  onTeamSelected,
  playerName,
  title, // Add custom title prop
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show) {
      // Reset form state
      setSearchInput('');
      setResults([]);
      setError('');
      setSelectedTeamId(null);
      setSelectedTeamName('');
      
      // Don't prevent body scrolling
      document.body.style.overflow = 'auto';
      
      // Scroll to top of page when modal opens
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Ensure body scrolling is restored
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      setError('Please enter a team name to search');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      const res = await searchService.searchTeamsByName(searchInput, token);
      
      // Limit to 10 results
      const limitedResults = (res.data || res || []).slice(0, 10);
      setResults(limitedResults);
      
      if (limitedResults.length === 0) {
        setError('No teams found matching your search');
      }
    } catch (err) {
      console.error('Team search failed:', err);
      setError(
        err.response?.data?.message || 
        'Failed to search teams. Please try again.'
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeamId(team.team?.id || team.id);
    setSelectedTeamName(team.team?.team_name || team.team_name || team.name || `Team ${team.id}`);
  };

  const handleConfirmSelection = () => {
    if (!selectedTeamId) {
      setError('Please select a team first');
      return;
    }

    // Call the callback with the selected team info
    onTeamSelected({
      id: selectedTeamId,
      name: selectedTeamName
    });
    
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      className="team-select-modal"
      size="lg"
      backdrop={false}
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Search size={20} className="me-2" />
          {title || `Select a Team to Recommend ${playerName || 'Player'} To`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3 d-flex">
            <Form.Control
              type="text"
              placeholder="Search team by name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={loading}
            />
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="ms-2"
            >
              {loading ? <Spinner size="sm" /> : 'Search'}
            </Button>
          </Form.Group>
        </Form>

        <div className="search-results mt-4">
          <h5>Search Results</h5>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <p className="mt-2">Searching for teams...</p>
            </div>
          ) : results.length > 0 ? (
            <div 
              className="team-list" 
              style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#6c757d #f8f9fa'
              }}
            >
              {results.map((team) => (
                <div 
                  key={team.id} 
                  className={`team-item p-2 mb-2 d-flex align-items-center ${selectedTeamId === (team.team?.id || team.id) ? 'selected' : ''}`}
                  onClick={() => handleTeamClick(team)}
                  style={{ cursor: 'pointer', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <div className="team-avatar me-3">
                    {team.logo || team.team?.logo ? (
                      <img 
                        src={
                          (team.logo || team.team?.logo).startsWith('http') 
                            ? (team.logo || team.team?.logo)
                            : `${import.meta.env.VITE_API_BASE_URL}/${team.logo || team.team?.logo}`
                        }
                        alt={`${team.team_name || team.name} logo`}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '4px',
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          // Fallback to Building icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <Building 
                      size={32} 
                      style={{ 
                        display: team.logo || team.team?.logo ? 'none' : 'block',
                        color: '#6c757d'
                      }} 
                    />
                  </div>
                  <div className="team-info">
                    <h6 className="mb-0">{team.team_name || team.name}</h6>
                    <small className="text-muted">
                      {team.country || 'Country N/A'} • {team.league || 'League N/A'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && (
            <p className="text-center text-muted">
              {searchInput ? 'No teams found matching your search' : 'Enter a team name to search'}
            </p>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirmSelection}
          disabled={!selectedTeamId}
        >
          Select Team
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TeamSelectModal;