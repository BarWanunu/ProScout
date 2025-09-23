import React from "react";

const TeamResultCard = ({ team, index }) => {
  return (
    <div className="result-item team-item">
      <div className="team-info">
        {team.logo && (
          <img 
            src={team.logo} 
            alt={`${team.team_name} logo`}
            className="team-logo"
            onError={(e) => {e.target.style.display = 'none'}}
          />
        )}
        
        <div className="team-details-wrapper">
          <h5>{team.team_name}</h5>
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