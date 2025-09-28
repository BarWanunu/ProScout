import { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Search, User } from 'lucide-react';
import searchService from '@/api/services/searchService';
import { getToken } from '@/api/tokenStore';
import defaultPlayerImg from '@/assets/default-player.png';
import './styles/SelectModals.css';

/**
 * Modal component for selecting a player to recommend to a team
 */
const PlayerSelectModal = ({ 
  show, 
  onHide,
  onPlayerSelected,
  teamName,
  isForTrial = false, 
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show) {
      // Reset form state
      setSearchInput('');
      setResults([]);
      setError('');
      setSelectedPlayerId(null);
      setSelectedPlayerName('');
      
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
      setError('Please enter a player name to search');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = getToken();
      const res = await searchService.searchPlayersByName(searchInput, token);
      
      // Limit to 20 results
      const limitedResults = (res.data || res || []).slice(0, 20);
      
      // Get enhanced player data using playerService.getPlayerFull for better display
      const enhancedResults = await Promise.all(
        limitedResults.map(async (player) => {
          try {
            // If we already have full data, use it
            if (player.player && player.player.full_name) {
              return player;
            }
            
            // Otherwise get the full player data
            const playerId = player.player?.id || player.id;
            if (playerId) {
              const playerService = await import('@/api/services/playerService');
              const fullData = await playerService.default.getPlayerFull(playerId, token);
              return {
                ...player,
                player: fullData.player || player.player || player,
                stats: fullData.stats
              };
            }
            return player;
          } catch (err) {
            console.error(`Could not get full data for player ${player.id}:`, err);
            return player;
          }
        })
      );
      
      setResults(enhancedResults);
      
      if (enhancedResults.length === 0) {
        setError('No players found matching your search');
      }
    } catch (err) {
      console.error('Player search failed:', err);
      setError(
        err.response?.data?.message || 
        'Failed to search players. Please try again.'
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayerId(player.player?.id || player.id);
    setSelectedPlayerName(player.player?.name || player.name || player.full_name || `Player ${player.id}`);
  };

  const handleConfirmSelection = () => {
    if (!selectedPlayerId) {
      setError('Please select a player first');
      return;
    }

    // Call the callback with the selected player info
    onPlayerSelected({
      id: selectedPlayerId,
      name: selectedPlayerName
    });
    
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      className="player-select-modal"
      size="lg"
      backdrop={false}
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Search size={20} className="me-2" />
          {isForTrial 
            ? `Select a Player for Trial with ${teamName}`
            : `Select a Player to Recommend to ${teamName}`
          }
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
              placeholder="Search player by name"
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
              <p className="mt-2">Searching for players...</p>
            </div>
          ) : results.length > 0 ? (
            <div 
              className="player-list"
              style={{ 
                maxHeight: '350px', 
                overflowY: 'auto',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#6c757d #f8f9fa'
              }}
            >
              {results.map((player) => {
                // Extract player data from nested structure if available
                const playerData = player.player || player;
                const playerId = playerData.id || player.id;
                const playerName = playerData.full_name || playerData.name || player.name || 'Unknown Player';
                const position = playerData.position || player.position || 'Position N/A';
                const nationality = playerData.nationality || playerData.country || player.nationality || player.country || 'Country N/A';
                const age = playerData.age || player.age || 'N/A';
                const photoUrl = playerData.photo_url || playerData.photo || player.photo_url;
                const imageUrl = photoUrl 
                  ? (photoUrl.startsWith('http') ? photoUrl : `${import.meta.env.VITE_API_BASE_URL}/${photoUrl}`)
                  : defaultPlayerImg;
                
                return (
                  <div 
                    key={playerId} 
                    className={`player-item p-2 mb-2 d-flex align-items-center ${selectedPlayerId === playerId ? 'selected' : ''}`}
                    onClick={() => handlePlayerClick(player)}
                    style={{ cursor: 'pointer', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    <div className="player-avatar me-3">
                      <img 
                        src={imageUrl} 
                        alt={playerName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                        onError={(e) => { e.target.src = defaultPlayerImg; }}
                      />
                    </div>
                    <div className="player-info">
                      <h6 className="mb-0">{playerName}</h6>
                      <small className="text-muted">
                        {position} • {nationality} • Age: {age}
                      </small>
                      {playerData.team_name && (
                        <div className="mt-1">
                          <small className="text-primary">Team: {playerData.team_name}</small>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !loading && (
            <p className="text-center text-muted">
              {searchInput ? 'No players found matching your search' : 'Enter a player name to search'}
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
          disabled={!selectedPlayerId}
        >
          {isForTrial 
            ? 'Select Player for Trial' 
            : 'Recommend Selected Player'
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerSelectModal;