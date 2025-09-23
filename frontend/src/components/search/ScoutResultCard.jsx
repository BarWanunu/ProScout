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
        {/* Always include image container, with default placeholder if no image */}
        <div className="scout-photo-container">
          <img 
            src={
              scout.image 
                ? scout.image.startsWith('http') 
                  ? scout.image
                  : `${import.meta.env.VITE_API_BASE_URL}/${scout.image}`
                : '/assets/default-scout.png'
            }
            alt={`${scout.first_name} ${scout.last_name}`}
            className="scout-photo"
            onError={(e) => {
              e.target.src = '/assets/default-scout.png';
            }}
          />
        </div>
        
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
            {scout.phone && <span className="badge phone">{scout.phone}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutResultCard;