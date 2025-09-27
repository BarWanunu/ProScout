import React from 'react';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import { PlayerInfo, PlayerStats, PlayerProfile } from './player';
import QuickMessageModal from '@/components/messages/QuickMessageModal';
import './styles/SearchResultCard.css';
import './styles/PlayerComponents.css';

const PlayerResultCard = ({ result, index, onRefreshShortlist, teamData, searchActions, onNavigateToProfile }) => {
  // Only create hook if searchActions is not provided
  const hookActions = searchActions ? null : useSearchActions({ onRefreshShortlist, teamData, onNavigateToProfile });
  const { 
    getActionsForUser,
    userRole,
    currentUserId,
    teamId,
    messageModal,
    closeMessageModal
  } = searchActions || hookActions;
  
  const normalizedResult = normalizeSearchResult(result);
  const actions = getActionsForUser(normalizedResult);

  return (
    <>
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
      
      {/* Quick Message Modal - only show if we have hook actions and no parent searchActions */}
      {!searchActions && messageModal && (
        <QuickMessageModal
          show={messageModal.show}
          onHide={closeMessageModal}
          recipientId={messageModal.recipientId}
          recipientName={messageModal.recipientName}
          recipientType={messageModal.recipientType}
        />
      )}
    </>
  );
};

export default PlayerResultCard;