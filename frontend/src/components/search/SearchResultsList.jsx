import React from 'react';
import PlayerResultCard from './PlayerResultCard';
import TeamResultCard from './TeamResultCard';
import ScoutResultCard from './ScoutResultCard';
import { getUserTypeFromResult } from '@/utils/searchResultUtils';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import PlayerSelectModal from '@/components/shared/PlayerSelectModal';
import TeamSelectModal from '@/components/shared/TeamSelectModal';
import './styles/SearchResultsList.css';
import './styles/SearchFixGlobal.css';
import './styles/SearchResultWrapper.css';

const SearchResultsList = ({ 
  results, 
  loading, 
  hasSearched, 
  searchType,
  className = '',
  onRefreshShortlist,
  teamData
}) => {
  // Get global modals state and handlers
  const searchActionsHook = useSearchActions({ onRefreshShortlist, teamData });
  const { 
    playerSelectModal, 
    closePlayerSelectModal, 
    handlePlayerSelected,
    teamSelectModal,
    closeTeamSelectModal,
    handleTeamSelected,
    currentUserId,
    getActionsForUser,
    userRole,
    teamId
  } = searchActionsHook;
  
  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h4>No results found</h4>
          <p>Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`search-results-container search-component-wrapper ${className}`}>
      <div className="results-header">
        <h4>Search Results ({results.length})</h4>
        <div className="results-summary">
          {searchType && (
            <span className={`search-type-indicator ${searchType}`}>
              {searchType === 'player' ? '⚽ Players' : 
               searchType === 'team' ? '🏆 Teams' : 
               searchType === 'scout' ? '🔍 Scouts' :
               '🔍 Mixed Results'}
            </span>
          )}
        </div>
      </div>
      
      <div className="results-list">
        {results.map((result, index) => {
          const resultType = getUserTypeFromResult(result);
          // Calculate a decreasing z-index for each item to ensure proper stacking
          const itemStyle = { 
            zIndex: 1000 - index,
            position: 'relative',
            marginBottom: '8px'
          };
          
          // Choose appropriate card component based on result type
          if (resultType === 'player' || searchType === 'player') {
            return (
              <div key={`player-container-${index}`} style={itemStyle} className="result-wrapper">
                <PlayerResultCard 
                  key={`player-${result.player?.id || result.id || index}`} 
                  result={result} 
                  index={index}
                  onRefreshShortlist={onRefreshShortlist}
                  teamData={teamData}
                  // Pass shared actions to avoid creating new hook instance
                  searchActions={{
                    getActionsForUser,
                    userRole,
                    currentUserId,
                    teamId
                  }}
                />
              </div>
            );
          } else if (resultType === 'team' || searchType === 'team') {
            return (
              <div key={`team-container-${index}`} style={itemStyle} className="result-wrapper">
                <TeamResultCard 
                  key={`team-${result.id || index}`} 
                  team={result} 
                  index={index}
                  // Pass shared actions to avoid creating new hook instance
                  searchActions={{
                    getActionsForUser,
                    userRole,
                    currentUserId,
                    teamId
                  }}
                />
              </div>
            );
          } else if (resultType === 'scout' || searchType === 'scout') {
            return (
              <div key={`scout-container-${index}`} style={itemStyle} className="result-wrapper">
                <ScoutResultCard 
                  key={`scout-${result.id || index}`} 
                  scout={result} 
                  index={index}
                  // Pass shared actions to avoid creating new hook instance
                  searchActions={{
                    getActionsForUser,
                    userRole,
                    currentUserId,
                    teamId
                  }}
                />
              </div>
            );
          } else {
            // Fallback for unknown result types
            return (
              <div key={`unknown-container-${index}`} style={itemStyle} className="result-wrapper">
                <div key={`unknown-${index}`} className="result-item unknown-item">
                  <div className="unknown-result">
                    <h5>{result.name || 'Unknown Result'}</h5>
                    <p>Result type not recognized</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      
      {/* Global Player Selection Modal for Scout Recommendations */}
      {playerSelectModal.show && (
        <PlayerSelectModal
          show={playerSelectModal.show}
          onHide={closePlayerSelectModal}
          onPlayerSelected={handlePlayerSelected}
          teamName={playerSelectModal.teamName}
          isForTrial={playerSelectModal.isForTrial}
        />
      )}
      
      {/* Global Team Selection Modal for Scout Recommending Players or Trial Invitations */}
      {teamSelectModal.show && (
        <TeamSelectModal
          show={teamSelectModal.show}
          onHide={closeTeamSelectModal}
          onTeamSelected={handleTeamSelected}
          playerName={teamSelectModal.playerName}
          title={teamSelectModal.isForTrial 
            ? `Select a Team for ${teamSelectModal.playerName || 'Player'}'s Trial`
            : `Select a Team to Recommend ${teamSelectModal.playerName || 'Player'} To`
          }
        />
      )}
    </div>
  );
};

export default SearchResultsList;