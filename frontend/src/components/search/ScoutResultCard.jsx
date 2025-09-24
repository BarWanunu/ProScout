import React from "react";
import ActionMenu from '@/components/shared/ActionMenu';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import './styles/SearchResultCard.css';

const ScoutResultCard = ({ scout, index }) => {
  const { getActionsForUser } = useSearchActions({});
  const normalizedResult = normalizeSearchResult(scout);
  const actions = getActionsForUser(normalizedResult);

  return (
    <div className="result-item scout-item">
      <div className="scout-info">
        <div className="scout-photo-container">
          {scout.image ? (
            <img
              src={scout.image}
              alt={`${scout.first_name} ${scout.last_name}`}
              className="scout-photo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="scout-photo-placeholder"
            style={{ display: scout.image ? 'none' : 'flex' }}
          >
            🔍
          </div>
        </div>

        <div className="scout-details">
          <div className="scout-header">
            <div className="scout-name-section">
              <h4 className="scout-name">
                {scout.first_name} {scout.last_name}
              </h4>
              <span className="scout-type-badge">🔍 Scout</span>
            </div>
            
            <ActionMenu actions={actions} />
          </div>

          <div className="scout-meta">
            <div className="scout-meta-item">
              <span className="meta-label">Experience:</span>
              <span className="meta-value">
                {scout.experience_years} years
              </span>
            </div>
            {scout.nationality && (
              <div className="scout-meta-item">
                <span className="meta-label">Nationality:</span>
                <span className="meta-value">{scout.nationality}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutResultCard;
