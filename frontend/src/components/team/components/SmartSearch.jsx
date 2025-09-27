import React, { useState } from 'react';
import Select from 'react-select';
import recommendationService from '@/api/services/recommendationSystemService';
import ReactMarkdown from 'react-markdown';
import '../styles/ScouterAI.css';


const gameStyles = ["Tiki-Taka", "Counter-Attack", "High Press", "Direct Play", "Positional Play", "Catenaccio"];
const playerExperience = ["Veteran", "Experienced", "Young", "Promising"];
const leagues = ["Serie A", "Ligue 1", "Premier League", "Bundesliga", "La Liga"];
const formations = ["4-3-1-2", "4-3-3", "3-5-2", "4-4-2", "3-4-3", "5-3-2", "4-2-3-1"];
const playerSkills = [
    "Key Passing", "Dribbling", "Speed", "Shooting", "Defending", "Aerial Ability", "Tackling", "Vision", "Long Passing", "Agility", "Strength", "Ball Control", "Positioning", "Finishing", "Crossing", "Marking", "Work Rate", "Stamina", "Free Kicks", "Leadership", "Penalty Saves", "Reactiveness", "Shot Stopping", "Off the Ball Movement", "Teamwork", "Creativity", "Game Intelligence"
].map(skill => ({ value: skill, label: skill }));


const ScouterAI = ({ data }) => {
  const [requirements, setRequirements] = useState({
    style: gameStyles[0],
    experience: playerExperience[0],
    league: leagues[0],
    formation: formations[0],
    skills: [],
  });
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport('');
    try {
      const payload = {
        selectedPlayer: data.selectedPlayer,
        recommendations: data.recommendations,
        teamRequirements: {
          ...requirements,
          skills: requirements.skills.map(s => s.value)
        }
      };
      const result = await recommendationService.generateScoutReport(payload);
      setReport(result.report);
    } catch (error) {
      console.error("Failed to generate AI report:", error);
      setReport("Error: Could not generate the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scouter-ai-container">
      <h2>Scouter AI</h2>
      <p>Select your team's ideal characteristics to generate a detailed scouting report.</p>
      <div className="content-wrapper">
        <div className="form-container">
          <h4>Team Requirements</h4>
          <label>Game Style</label>
          <Select options={gameStyles.map(s => ({ value: s, label: s }))} defaultValue={{ value: requirements.style, label: requirements.style }} onChange={opt => setRequirements(prev => ({ ...prev, style: opt.value }))} />

          <label>Player Experience</label>
          <Select options={playerExperience.map(s => ({ value: s, label: s }))} defaultValue={{ value: requirements.experience, label: requirements.experience }} onChange={opt => setRequirements(prev => ({ ...prev, experience: opt.value }))} />
          
          <label>Preferred League</label>
          <Select options={leagues.map(s => ({ value: s, label: s }))} defaultValue={{ value: requirements.league, label: requirements.league }} onChange={opt => setRequirements(prev => ({ ...prev, league: opt.value }))} />

          <label>Ideal Formation</label>
          <Select options={formations.map(s => ({ value: s, label: s }))} defaultValue={{ value: requirements.formation, label: requirements.formation }} onChange={opt => setRequirements(prev => ({ ...prev, formation: opt.value }))} />

          <label>Key Skills</label>
          <Select isMulti options={playerSkills} onChange={opts => setRequirements(prev => ({ ...prev, skills: opts }))} />

          <button onClick={handleGenerateReport} disabled={isLoading} className="generate-button">
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
        <div className="report-container">
          <h4>AI Scout Report</h4>
          {isLoading && <div className="loading-spinner">Generating report...</div>}
          {report ? (
            <div className="report-content">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          ) : (
            <div className="report-placeholder">Your generated report will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScouterAI;