import React from 'react';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import { PlayerInfo, PlayerStats, PlayerProfile } from './player';
import TrialInvitationModal from '@/components/shared/TrialInvitationModal';
import './styles/SearchResultCard.css';
import './styles/PlayerComponents.css';

const PlayerResultCard = ({ result, index, onRefreshShortlist }) => {
  const { 
    getActionsForUser, 
    trialModal, 
    closeTrialModal, 
    handleTrialCreated,
    userRole,
    currentUserId
  } = useSearchActions({ onRefreshShortlist });
  
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

      {/* Trial Invitation Modal */}
      <TrialInvitationModal
        show={trialModal.show}
        onHide={closeTrialModal}
        playerId={trialModal.playerId}
        playerName={trialModal.playerName}
        onTrialCreated={handleTrialCreated}
        senderRole={userRole}
        senderId={currentUserId}
      />
    </>
  );
};

export default PlayerResultCard;