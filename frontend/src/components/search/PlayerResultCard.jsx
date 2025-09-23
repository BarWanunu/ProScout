import React from 'react';
import ActionMenu from '@/components/shared/ActionMenu';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import './SearchResultCard.css';

const PlayerResultCard = ({ result, index }) => {
  const { getActionsForUser } = useSearchActions();
  const normalizedResult = normalizeSearchResult(result);
  const actions = getActionsForUser(normalizedResult);

  return (
    <div className="result-item player-item">
      <div className="player-info">
        <div className="player-photo-container">
          <img 
            src={
              result.player?.photo 
                ? result.player.photo.startsWith('http') 
                  ? result.player.photo
                  : `${import.meta.env.VITE_API_BASE_URL}/${result.player.photo}`
                : '/assets/default-player.png'
            }
            alt={result.player?.name || result.name}
            className="player-photo"
            onError={(e) => {
              e.target.src = '/assets/default-player.png';
            }}
          />
        </div>
        
        <div className="player-details">
          <div className="basic-info">
            <div className="player-header">
              <h5>{result.player?.name || result.name}</h5>
              <ActionMenu 
                actions={actions}
                trigger={
                  <button className="more-actions-btn">
                    <span className="more-actions-icon">⋮</span>
                    More Actions
                  </button>
                }
                position="bottom-right"
              />
            </div>
            <div className="player-meta">
              <span className="position">{result.player?.position}</span>
              <span className="club">{result.player?.club || result.club}</span>
              <span className="age">{result.player?.age} years</span>
              <span className="nationality">{result.player?.nationality}</span>
              {result.player?.number && <span className="number">#{result.player.number}</span>}
            </div>
          </div>
          
          {/* Search Type Badge */}
          {result.searchType && (
            <div className="search-type-badge">
              <span className={`badge ${result.searchType === 'statistics' ? 'stats' : result.searchType}`}>
                {(result.searchType === 'profile') ? 'Profile Match' : 'Stats Match'}
              </span>
            </div>
          )}

          {/* Matched Criteria */}
          <div className="matched-criteria">
            <h6>Matched Criteria:</h6>
            
            {/* Matched criteria tags for both profile and statistics search */}
            <div className="criteria-tags-container">
              {result.matchedCriteria ? (
                Object.entries(result.matchedCriteria).filter(([key, value]) => value && value !== "").length > 0 ? (
                  Object.entries(result.matchedCriteria).map(([key, value]) => {
                    if (value && value !== "") {
                      // Display a human-readable label for each criteria
                      const label = key.replace(/_/g, ' ');
                      return (
                        <span key={key} className="criteria-tag-badge">
                          {`${label}: ${value}`}
                        </span>
                      );
                    }
                    return null;
                  })
                ) : (
                  <span className="criteria-tag-badge">General Match</span>
                )
              ) : (
                <span className="criteria-tag-badge">General Match</span>
              )}
            </div>
          </div>
          
          {/* LATEST SEASON header for both profile and statistics search */}
          {(result.stats && result.stats.length > 0) || (result.searchType === 'statistics' && result.matchedCriteria) ? (
            <div className="season-header">
              <h6>LATEST SEASON ({(result.searchType === 'statistics' ? result.matchedStats?.season : result.stats?.[result.stats.length - 1]?.season) || '2024'})</h6>
            </div>
          ) : null}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="player-stats">
        {result.searchType === 'statistics' && result.matchedCriteria ? (
          // Show only searched fields + rating for statistics search
          <>
            <div className={`stats-grid ${Object.keys(result.matchedCriteria).filter(key => key.startsWith('min_')).length === 0 ? 'single-stat' : ''}`}>
              {/* Always show rating */}
              <div className="stat-item">
                <span className="stat-label">Rating</span>
                <span className="stat-value">{result.matchedStats?.rating || 'N/A'}</span>
              </div>
              
              {/* Show stats based on what was searched for */}
              {result.matchedCriteria.min_goals && (
                <div className="stat-item">
                  <span className="stat-label">Goals</span>
                  <span className="stat-value">{result.matchedStats?.goals || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_assists && (
                <div className="stat-item">
                  <span className="stat-label">Assists</span>
                  <span className="stat-value">{result.matchedStats?.assists || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_yellow_cards && (
                <div className="stat-item">
                  <span className="stat-label">Yellow Cards</span>
                  <span className="stat-value">{result.matchedStats?.yellow_cards || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_red_cards && (
                <div className="stat-item">
                  <span className="stat-label">Red Cards</span>
                  <span className="stat-value">{result.matchedStats?.red_cards || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_passes_completed && (
                <div className="stat-item">
                  <span className="stat-label">Passes Completed</span>
                  <span className="stat-value">{result.matchedStats?.passes_completed || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_key_passes && (
                <div className="stat-item">
                  <span className="stat-label">Key Passes</span>
                  <span className="stat-value">{result.matchedStats?.key_passes || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_shots_on_target && (
                <div className="stat-item">
                  <span className="stat-label">Shots on Target</span>
                  <span className="stat-value">{result.matchedStats?.shots_on_target || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_dribbles_attempted && (
                <div className="stat-item">
                  <span className="stat-label">Dribbles Attempted</span>
                  <span className="stat-value">{result.matchedStats?.dribbles_attempted || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_dribbles_success && (
                <div className="stat-item">
                  <span className="stat-label">Dribbles Success</span>
                  <span className="stat-value">{result.matchedStats?.dribbles_success || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_dribble_success_rate && (
                <div className="stat-item">
                  <span className="stat-label">Dribble Success Rate</span>
                  <span className="stat-value">{result.matchedStats?.dribble_success_rate || 0}%</span>
                </div>
              )}
              {result.matchedCriteria.min_tackles && (
                <div className="stat-item">
                  <span className="stat-label">Tackles</span>
                  <span className="stat-value">{result.matchedStats?.tackles || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_interceptions && (
                <div className="stat-item">
                  <span className="stat-label">Interceptions</span>
                  <span className="stat-value">{result.matchedStats?.interceptions || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_duels && (
                <div className="stat-item">
                  <span className="stat-label">Duels</span>
                  <span className="stat-value">{result.matchedStats?.duels || 0}</span>
                </div>
              )}
              {result.matchedCriteria.min_duels_won && (
                <div className="stat-item">
                  <span className="stat-label">Duels Won</span>
                  <span className="stat-value">{result.matchedStats?.duels_won || 0}</span>
                </div>
              )}
            </div>
          </>
        ) : result.stats && result.stats.length > 0 ? (
          // Show latest season for profile searches
          <>
            <div className="stats-grid profile-stats">
              {result.player?.position === 'Goalkeeper' && (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].rating}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Passes Completed</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].passes_completed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Yellow Cards</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].yellow_cards}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Red Cards</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].red_cards}</span>
                  </div>
                </>
              )}
              
              {result.player?.position === 'Defender' && (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].rating}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tackles</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].tackles}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Interceptions</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].interceptions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Duels</span>
                    <span className="stat-value">{result.stats[result.stats.length-1].duels_won}/{result.stats[result.stats.length - 1].duels}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Yellow Cards</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].yellow_cards}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Red Cards</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].red_cards}</span>
                  </div>
                </>
              )}
              
              {result.player?.position === 'Midfielder' && (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].rating}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Passes</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].passes_completed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Key Passes</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].key_passes}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Assists</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].assists}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Dribbles</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].dribbles_success}/{result.stats[result.stats.length - 1].dribbles_attempted}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Yellow Cards</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].yellow_cards}</span>
                  </div>
                </>
              )}
              
              {(result.player?.position === 'Forward' || result.player?.position === 'Attacker') && (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].rating}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Goals</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].goals}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Assists</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].assists}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Shots on Target</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].shots_on_target}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Dribbles</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].dribbles_success}/{result.stats[result.stats.length - 1].dribbles_attempted}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Yellow Cards</span>
                    <span className="stat-value">{result.stats[result.stats.length - 1].yellow_cards}</span>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <p>No statistics available</p>
        )}
      </div>
    </div>
  );
};

export default PlayerResultCard;