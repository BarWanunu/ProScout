const PlayerProfile = ({ result }) => {
  if (!result.stats || result.stats.length === 0) {
    return <p>No statistics available</p>;
  }
  
  const latestStats = result.stats[result.stats.length - 1];
  const { position } = result.player || {};

  return (
    <div className="player-stats">
      <div className="stats-grid profile-stats">
        {position === 'Goalkeeper' && (
          <>
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">{latestStats.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Passes Completed</span>
              <span className="stat-value">{latestStats.passes_completed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Yellow Cards</span>
              <span className="stat-value">{latestStats.yellow_cards}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Red Cards</span>
              <span className="stat-value">{latestStats.red_cards}</span>
            </div>
          </>
        )}
        
        {position === 'Defender' && (
          <>
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">{latestStats.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tackles</span>
              <span className="stat-value">{latestStats.tackles}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Interceptions</span>
              <span className="stat-value">{latestStats.interceptions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Duels</span>
              <span className="stat-value">{latestStats.duels_won}/{latestStats.duels}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Yellow Cards</span>
              <span className="stat-value">{latestStats.yellow_cards}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Red Cards</span>
              <span className="stat-value">{latestStats.red_cards}</span>
            </div>
          </>
        )}
        
        {position === 'Midfielder' && (
          <>
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">{latestStats.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Passes</span>
              <span className="stat-value">{latestStats.passes_completed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Key Passes</span>
              <span className="stat-value">{latestStats.key_passes}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Assists</span>
              <span className="stat-value">{latestStats.assists}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dribbles</span>
              <span className="stat-value">{latestStats.dribbles_success}/{latestStats.dribbles_attempted}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Yellow Cards</span>
              <span className="stat-value">{latestStats.yellow_cards}</span>
            </div>
          </>
        )}
        
        {(position === 'Forward' || position === 'Attacker') && (
          <>
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">{latestStats.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Goals</span>
              <span className="stat-value">{latestStats.goals}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Assists</span>
              <span className="stat-value">{latestStats.assists}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Shots on Target</span>
              <span className="stat-value">{latestStats.shots_on_target}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dribbles</span>
              <span className="stat-value">{latestStats.dribbles_success}/{latestStats.dribbles_attempted}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Yellow Cards</span>
              <span className="stat-value">{latestStats.yellow_cards}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;