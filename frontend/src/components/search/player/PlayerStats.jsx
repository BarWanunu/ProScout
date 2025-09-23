import React from 'react';

const PlayerStats = ({ result }) => {
  if (result.searchType === 'statistics' && result.matchedCriteria) {
    return (
      <div className="player-stats">
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
              <span className="stat-label">Passes</span>
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
              <span className="stat-label">Shots</span>
              <span className="stat-value">{result.matchedStats?.shots_on_target || 0}</span>
            </div>
          )}
          {result.matchedCriteria.min_dribbles_attempted && (
            <div className="stat-item">
              <span className="stat-label">Dribbles</span>
              <span className="stat-value">{result.matchedStats?.dribbles_attempted || 0}</span>
            </div>
          )}
          {result.matchedCriteria.min_dribbles_success && (
            <div className="stat-item">
              <span className="stat-label">Successful Dribbles</span>
              <span className="stat-value">{result.matchedStats?.dribbles_success || 0}</span>
            </div>
          )}
          {result.matchedCriteria.min_dribble_success_rate && (
            <div className="stat-item">
              <span className="stat-label">Dribble Rate</span>
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
      </div>
    );
  }
  
  return null;
};

export default PlayerStats;