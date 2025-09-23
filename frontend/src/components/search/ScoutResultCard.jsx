import React from "react";
import ActionMenu from '@/components/shared/ActionMenu';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import './SearchResultCard.css';

const ScoutResultCard = ({ scout, index }) => {
  const { getActionsForUser } = useSearchActions();
  const normalizedResult = normalizeSearchResult(scout);
  const actions = getActionsForUser(normalizedResult);

  return (
    <div className="result-item scout-item">
      <div className="scout-info">
        {scout.image && (
          <img 
            src={scout.image} 
            alt={`${scout.first_name} ${scout.last_name}`}
            className="scout-photo"
            onError={(e) => {e.target.style.display = 'none'}}
          />
        )}
        
        <div className="scout-details-wrapper">
          <div className="scout-header">
            <h5>{`${scout.first_name} ${scout.last_name}`}</h5>
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
          <div className="scout-details">
            <span className="badge nationality">{scout.nationality}</span>
            <span className="badge experience">{scout.experience_years} years experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutResultCard;