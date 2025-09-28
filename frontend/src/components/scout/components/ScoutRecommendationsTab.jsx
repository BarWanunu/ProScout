import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { Trash2, Edit2, Users } from 'lucide-react';
import recommendationService from '@/api/services/recommendationService';
import scoutService from '@/api/services/scoutService';
import teamService from '@/api/services/teamService';
import playerService from '@/api/services/playerService';
import { useAuth } from '@/auth/AuthContext';
import { getToken } from '@/api/tokenStore';
import defaultPlayerImg from '@/assets/default-player.png';
import defaultTeamImg from '@/assets/teamPhoto.jpg';
import '../styles/ScoutRecommendationsTab.css';

const ScoutRecommendationsTab = () => {
  const { id: currentUserId } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamDetails, setTeamDetails] = useState({});
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [playerDetails, setPlayerDetails] = useState({});

  const token = getToken();

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await recommendationService.getRecommendationsByScout(token);
      setRecommendations(response.recommendations || []);
    } catch (err) {
      console.error('Failed to load scout recommendations:', err);
      setError('Failed to load recommendations.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const getTeamDetail = (teamId, field) => {
    const t = teamDetails[teamId];
    return t ? (t[field] || 'N/A') : 'N/A';
  };

  const getTeamLogo = (teamId) => {
    const team = teamDetails[teamId];
    if (!team) return defaultTeamImg;
    if (team.logo) {
      if (team.logo.startsWith('http')) return team.logo;
      return `${import.meta.env.VITE_API_BASE_URL}/${team.logo}`;
    }
    return defaultTeamImg;
  };

  // Fetch team and player details lazily
  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
       const teamsToFetch = Array.from(new Set(recommendations.map(r => r.teams_id).filter(Boolean)));
      
      for (const teamId of teamsToFetch) {
        if (!teamDetails[teamId]) {
          try {
            const data = await teamService.getTeamByTeamId(teamId);
            setTeamDetails(prev => ({ ...prev, [teamId]: data.team || data }));
          } catch (err) {
          }
        }
      }
      
      const playersToFetch = Array.from(new Set(recommendations.map(r => r.player_id).filter(Boolean)));      
      for (const playerId of playersToFetch) {
        if (!playerDetails[playerId]) {
          try {
            const res = await playerService.getPlayerFull(playerId, token);
            const data = res.player;
            setPlayerDetails(prev => ({ ...prev, [playerId]: data }));
          } catch (err) {
            // Set placeholder data for missing player
            setPlayerDetails(prev => ({ 
              ...prev, 
              [playerId]: { 
                name: 'Player Not Found',
                first_name: 'Player',
                last_name: 'Not Found',
                image: null
              }
            }));
          }
        }
      }
    };
    if (recommendations.length) fetchTeamsAndPlayers();
    // eslint-disable-next-line
  }, [recommendations, teamDetails, playerDetails]);
  const getPlayerName = (playerId) => {
    const p = playerDetails[playerId];
    if (!p) return 'Loading...';
    if (p.name) return p.name;
    const fullName = `${p.first_name || p.firstName || ''} ${p.last_name || p.lastName || ''}`.trim();
    return fullName || 'Unknown Player';
  };

  const getPlayerImage = (playerId) => {
    const p = playerDetails[playerId];
    if (!p) return defaultPlayerImg;
    if (p.photo) {
      if (p.photo.startsWith('http')) return p.photo;
      return `${import.meta.env.VITE_API_BASE_URL}/${p.photo}`;
    }
    return defaultPlayerImg;
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this recommendation?')) {
      confirmDelete(id);
    }
  };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      await recommendationService.deleteRecommendation(id, token);
      setRecommendations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete recommendation', err);
      setError('Failed to delete recommendation.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (rec) => {
    setEditing(rec.id);
    setEditText(rec.recommendation_note || '');
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditText('');
  };

  const saveEdit = async () => {
    try {
      setLoading(true);
      const payload = { recommendation_note: editText };
      const resp = await recommendationService.updateRecommendation(editing, payload, token);
      setRecommendations(prev => prev.map(r => r.id === editing ? resp.recommendation : r));
      setEditing(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to update recommendation', err);
      setError('Failed to update recommendation.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <Spinner animation="border" className="loading-spinner" />
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="error-alert">{error}</Alert>
  );

  if (!recommendations.length) return (
    <Container className="shortlist-empty">
      <Card className="empty-state">
        <Users size={48} className="empty-icon" />
        <p className="empty-text">You haven't made any recommendations yet.</p>
      </Card>
    </Container>
  );

  return (
    <div className="scout-recommendations-tab">
      <div className="shortlist-header">
        <h4>My Recommendations</h4>
        <p className="shortlist-counter">{recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} sent by you</p>
      </div>

      <div className="shortlist-container">
        {recommendations.map(rec => (
          <div key={rec.id} className="scout-recommendation-card">
            <div className="recommendation-header">
              <div className="team-logo-section">
                <img 
                  src={getTeamLogo(rec.teams_id)} 
                  alt={getTeamDetail(rec.teams_id, 'team_name')} 
                  className="team-logo" 
                  onError={(e)=>e.target.src=defaultTeamImg} 
                />
              </div>
              <div className="recommendation-main-info">
                <h5 className="team-name">{getTeamDetail(rec.teams_id, 'team_name')}</h5>
                <div className="recommendation-date">Recommended on {new Date(rec.created_at).toLocaleDateString('en-GB')}</div>
                
                <div className="player-info-section">
                  <img 
                    src={getPlayerImage(rec.player_id)} 
                    alt={getPlayerName(rec.player_id)} 
                    className="player-avatar"
                    onError={(e) => {
                      e.target.src = defaultPlayerImg;
                    }}
                  />
                  <div className="player-details">
                    <div className="player-name">
                      <strong>Player:</strong> {getPlayerName(rec.player_id)}
                      {!playerDetails[rec.player_id] && <span className="player-id"> (ID: {rec.player_id})</span>}
                    </div>
                    {playerDetails[rec.player_id] && playerDetails[rec.player_id].club && (
                      <div className="player-club">
                        Plays for: {playerDetails[rec.player_id].club}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {editing === rec.id ? (
              <div className="edit-form">
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={editText} 
                  onChange={(e)=>setEditText(e.target.value)}
                  className="edit-textarea"
                />
                <div className="edit-buttons">
                  <Button size="sm" className="cancel-btn" onClick={cancelEdit}>Cancel</Button>
                  <Button size="sm" className="save-btn" onClick={saveEdit}>Save</Button>
                </div>
              </div>
            ) : (
              rec.recommendation_note && (
                <div className="recommendation-note">
                  <p className="recommendation-note-text">"{rec.recommendation_note}"</p>
                </div>
              )
            )}

            <div className="action-buttons">
              <Button size="sm" className="edit-btn action-btn" onClick={() => startEdit(rec)}>
                <Edit2 size={14} />
              </Button>
              <Button size="sm" className="delete-btn action-btn" onClick={() => handleDelete(rec.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoutRecommendationsTab;
