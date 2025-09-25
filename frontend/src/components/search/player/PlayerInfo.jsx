import React from 'react';
import ActionMenu from '@/components/actionMenu';

const PlayerInfo = ({ result, actions }) => {
  return (
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
  );
};

export default PlayerInfo;