import React from "react";
import ActionMenu from '@/components/shared/ActionMenu';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import './styles/SearchResultCard.css';

const TeamResultCard = ({ team, index }) => {
  const { getActionsForUser } = useSearchActions();
  const normalizedResult = normalizeSearchResult(team);
  const actions = getActionsForUser(normalizedResult);

  return (
    <div className="result-item team-item">
      <div className="team-info">
        <div className="team-logo-container">
          <img 
            src={
              team.logo 
                ? team.logo.startsWith('http') 
                  ? team.logo
                  : `${import.meta.env.VITE_API_BASE_URL}/${team.logo}`
                : '/assets/default-team.png'
            }
            alt={`${team.team_name} logo`}
            className="team-logo"
            onError={(e) => {
              e.target.src = '/assets/default-team.png';
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
  );
};

export default TeamResultCard;