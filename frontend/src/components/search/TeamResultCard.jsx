import ActionMenu from '@/components/actionMenu';
import QuickMessageModal from '@/components/messages/QuickMessageModal';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import defaultTeamImg from '@/assets/teamPhoto.jpg';
import './styles/SearchResultCard.css';

const TeamResultCard = ({ team, index, searchActions, onNavigateToProfile }) => {
  // Only create hook if searchActions is not provided
  const hookActions = searchActions ? null : useSearchActions({ onNavigateToProfile });
  const { 
    getActionsForUser,
    messageModal,
    closeMessageModal
  } = searchActions || hookActions;
  const normalizedResult = normalizeSearchResult(team);
  const actions = getActionsForUser(normalizedResult);

  return (
    <>
      <div className="result-item team-item">
        <div className="team-info">
          <div className="team-logo-container">
            <img 
              src={
                team.logo 
                  ? team.logo.startsWith('http') 
                    ? team.logo
                    : `${import.meta.env.VITE_API_BASE_URL}/${team.logo}`
                  : defaultTeamImg
              }
              alt={`${team.team_name} logo`}
              className="team-logo"
              onError={(e) => {
                e.target.src = defaultTeamImg;
              }}
            />
          </div>
          
          <div className="team-details-wrapper">
            <div className="team-header">
              <h5>{team.team_name}</h5>
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
            <div className="team-details">
              <span className="badge country">{team.country}</span>
              <span className="badge league">{team.league}</span>
              <span className="badge formation">{team.formation}</span>
              <span className="stadium">{team.stadium}</span>
              <span className="trophies">🏆 {team.trophies}</span>
            </div>
          </div>
        </div>
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

export default TeamResultCard;