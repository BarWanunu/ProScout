import React from "react";
import ActionMenu from '@/components/actionMenu';
import { useSearchActions } from '@/hooks/search/useSearchActions';
import { normalizeSearchResult } from '@/utils/searchResultUtils';
import { MoreVertical } from 'lucide-react';
import './styles/SearchResultCard.css';
import './styles/PlayerComponents.css';

const ScoutResultCard = ({ scout, index, searchActions, onNavigateToProfile }) => {
  // Only create hook if searchActions is not provided
  const hookActions = searchActions ? null : useSearchActions({ onNavigateToProfile });
  const { getActionsForUser } = searchActions || hookActions;
  const normalizedResult = normalizeSearchResult(scout);
  const actions = getActionsForUser(normalizedResult);

  // Get scout data from either scout directly or scout.scout nested object
  const scoutData = scout.scout || scout;
  
  return (
    <div className="result-item scout-item">
      {/* Scout Basic Information */}
      <div className="scout-info">
        <div className="scout-photo-container">
          <img 
            src={
              scoutData?.image 
                ? scoutData.image.startsWith('http') 
                  ? scoutData.image
                  : `${import.meta.env.VITE_API_BASE_URL}/${scoutData.image}`
                : '/assets/default-scout.png'
            }
            alt={`${scoutData?.first_name || ''} ${scoutData?.last_name || ''}`}
            className="scout-photo"
            onError={(e) => {
              e.target.src = '/assets/default-scout.png';
            }}
          />
        </div>
        
        <div className="scout-details">
          <div className="basic-info">
            <div className="scout-header">
              <h5>{`${scoutData?.first_name || ''} ${scoutData?.last_name || ''}`.trim() || 'Scout'}</h5>
            </div>
          </div>

          {/* Scout Statistics/Info - in horizontal layout */}
          <div className="scout-profile">
            <div className="profile-stats horizontal-stats">
              <div className="stat-item">
                <span className="stat-label">Experience:</span>
                <span className="stat-value">
                  {scoutData?.experience_years || 'N/A'} years
                </span>
              </div>
              
              {scoutData?.nationality && (
                <div className="stat-item">
                  <span className="stat-label">Nationality:</span>
                  <span className="stat-value">{scoutData.nationality}</span>
                </div>
              )}
              
              {scoutData?.phone && (
                <div className="stat-item">
                  <span className="stat-label">Phone:</span>
                  <span className="stat-value">{scoutData.phone}</span>
                </div>
              )}
            </div>
          </div>
          <div className="actions-container">
                <ActionMenu 
                  actions={actions}
                  trigger={
                    <button className="more-actions-btn">
                      <MoreVertical size={16} />
                      <span className="actions-text">More Actions</span>
                    </button>
                  }
                />
              </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutResultCard;
