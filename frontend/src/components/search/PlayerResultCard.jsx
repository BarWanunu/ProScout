import React from 'react';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import { PlayerInfo, PlayerStats, PlayerProfile } from './player';
import './styles/SearchResultCard.css';
import './styles/PlayerComponents.css';

const PlayerResultCard = ({ result, index, onRefreshShortlist, teamData, searchActions }) => {
  // Use the passed searchActions if available, otherwise create a new hook instance
  const hookActions = useSearchActions({ onRefreshShortlist, teamData });
  const { 
    getActionsForUser,
    userRole,
    currentUserId,
    teamId
  } = searchActions || hookActions;
  
  const normalizedResult = normalizeSearchResult(result);
  const actions = getActionsForUser(normalizedResult);

  return (
    <div className="result-item player-item">
      {/* Player Basic Information */}
      <PlayerInfo result={result} actions={actions} />

      {/* Statistics Section */}
      {result.searchType === 'statistics' ? (
        <PlayerStats result={result} />
      ) : (
        <PlayerProfile result={result} />
      )}
    </div>
  );
};

export default PlayerResultCard;