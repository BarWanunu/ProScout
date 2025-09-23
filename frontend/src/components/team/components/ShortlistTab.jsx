import React from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { UserMinus } from 'lucide-react';
import '../styles/ShortlistTab.css';

const ShortlistTab = ({ shortlist = [] }) => {
  // אם אין שחקנים ברשימת המועדפים
  if (!shortlist || shortlist.length === 0) {
    return (
      <Container className="py-4 shortlist-empty">
        <Card className="text-center p-5">
          <h4 className="mb-3">Your Shortlist is Empty</h4>
          <p>
            Add players to your shortlist to keep track of talents you're interested in.
            Use the search feature to find and add players.
          </p>
          <div className="mt-4">
            <Button variant="primary">Search Players</Button>
          </div>
        </Card>
      </Container>
    );
  }

  // הסרת שחקן מהרשימה (לחיצה על כפתור)
  const handleRemovePlayer = (playerId) => {
    console.log(`Removing player with ID: ${playerId}`);
    // כאן צריך להוסיף את הלוגיקה האמיתית להסרת שחקן
  };

  return (
    <div className="shortlist-tab">
      <div className="shortlist-header">
        <h4>Your Player Shortlist</h4>
        <p>Players you've marked as interesting for your team</p>
      </div>

      <Card className="shortlist-card">
        <Card.Body>
          <Table responsive hover className="shortlist-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Position</th>
                <th>Age</th>
                <th>Club</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shortlist.map((player) => (
                <tr key={player.player_id}>
                  <td>
                    <div className="player-info">
                      {player.image && (
                        <img 
                          src={player.image.startsWith('http') 
                            ? player.image 
                            : `${import.meta.env.VITE_API_BASE_URL}/${player.image}`
                          } 
                          alt={player.name} 
                          className="player-avatar" 
                        />
                      )}
                      <span>{player.name}</span>
                    </div>
                  </td>
                  <td>{player.position}</td>
                  <td>{player.age || 'N/A'}</td>
                  <td>{player.club}</td>
                  <td>
                    <div className="rating-badge">
                      {player.rating || '---'}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleRemovePlayer(player.player_id)}
                      >
                        <UserMinus size={16} /> Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ShortlistTab;