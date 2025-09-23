import React from 'react';
import PlayerResultCard from './PlayerResultCard';
import TeamResultCard from './TeamResultCard';
import ScoutResultCard from './ScoutResultCard';
import { getUserTypeFromResult } from '@/utils/searchResultUtils';
import './SearchResultsList.css';

const SearchResultsList = ({ 
  results, 
  loading, 
  hasSearched, 
  searchType,
  className = ''
}) => {
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
    <div className={`search-results-container ${className}`}>
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
          
          // Choose appropriate card component based on result type
          if (resultType === 'player' || searchType === 'player') {
            return (
              <PlayerResultCard 
                key={`player-${result.player?.id || result.id || index}`} 
                result={result} 
                index={index} 
              />
            );
          } else if (resultType === 'team' || searchType === 'team') {
            return (
              <TeamResultCard 
                key={`team-${result.id || index}`} 
                team={result} 
                index={index} 
              />
            );
          } else if (resultType === 'scout' || searchType === 'scout') {
            return (
              <ScoutResultCard 
                key={`scout-${result.id || index}`} 
                scout={result} 
                index={index} 
              />
            );
          } else {
            // Fallback for unknown result types
            return (
              <div key={`unknown-${index}`} className="result-item unknown-item">
                <div className="unknown-result">
                  <h5>{result.name || 'Unknown Result'}</h5>
                  <p>Result type not recognized</p>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default SearchResultsList;