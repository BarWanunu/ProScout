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
  const [structured, setStructured] = useState(null);
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
      setStructured(result.structured || null);
    } catch (error) {
      console.error("Failed to generate AI report:", error);
      setReport("Error: Could not generate the report. Please try again.");
      setStructured(null);
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

          <div className="constraints-badge fade-in">
            <span>{requirements.experience}</span>
            <span>{requirements.league}</span>
            <span>{requirements.style}</span>
            <span>{requirements.formation}</span>
            {requirements.skills.slice(0,2).map(s => <span key={s.value}>{s.value}</span>)}
            {requirements.skills.length > 2 && <span>+{requirements.skills.length - 2}</span>}
          </div>

          <button onClick={handleGenerateReport} disabled={isLoading} className="generate-button">
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
        <div className="report-container">
          <h4>AI Scout Report</h4>
          {isLoading && <div className="loading-spinner">Generating report...</div>}
          {structured ? (
            <div className="report-content fade-in">
              <h5 style={{marginTop:0,fontSize:'0.9rem',letterSpacing:'.5px',textTransform:'uppercase',color:'#475569'}}>Suggested Players</h5>
              <div style={{display:'grid',gap:'0.9rem'}}>
                {structured.players.map(p => {
                  const isRec = structured.recommended === p.name;
                  return (
                    <div key={p.name} style={{
                      border:'1px solid '+(isRec?'#2563eb':'#e2e8f0'),
                      background:isRec?'linear-gradient(135deg,#eff6ff,#ffffff)':'#fff',
                      borderRadius:10,padding:'0.75rem 0.85rem',
                      boxShadow:isRec?'0 4px 10px -2px rgba(37,99,235,.25)':'0 1px 2px rgba(15,23,42,.06)'
                    }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                        <strong style={{fontSize:'.9rem',color:'#0f172a'}}>{p.name}</strong>
                        <span style={{fontSize:'.65rem',fontWeight:600,background:'#1e293b',color:'#fff',padding:'2px 6px',borderRadius:6,letterSpacing:'.5px'}}>{p.similarity_pct}% SIM</span>
                      </div>
                      <div style={{fontSize:'.7rem',color:'#64748b',marginBottom:6}}>
                        {p.league && <span style={{marginRight:8}}>{p.league}</span>}
                        {p.age && <span>Age {p.age}</span>}
                        {isRec && <span style={{marginLeft:8,color:'#1d4ed8',fontWeight:600}}>RECOMMENDED</span>}
                      </div>
                      <p style={{fontSize:'.78rem',color:'#334155',lineHeight:'1.15rem',margin:'0 0 6px'}}>{p.summary}</p>
                      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                        {p.strengths && p.strengths.slice(0,4).map(s => <span key={s} style={{background:'#dcfce7',color:'#166534',fontSize:'.6rem',padding:'3px 6px',borderRadius:6,fontWeight:600}}>{s}</span>)}
                        {p.concerns && p.concerns.slice(0,2).map(c => <span key={c} style={{background:'#fee2e2',color:'#991b1b',fontSize:'.6rem',padding:'3px 6px',borderRadius:6,fontWeight:600}}>{c}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:'1rem',padding:'0.75rem 0.9rem',background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:10}}>
                <strong style={{fontSize:'.75rem',letterSpacing:'.5px',textTransform:'uppercase',color:'#0f172a'}}>Most Suitable Player</strong>
                <p style={{fontSize:'.78rem',lineHeight:'1.15rem',color:'#334155',margin:'6px 0 0'}}>{structured.reasoning}</p>
              </div>
            </div>
          ) : report ? (
            <div className="report-content"><ReactMarkdown>{report}</ReactMarkdown></div>
          ) : <div className="report-placeholder">Your generated report will appear here.</div>}
        </div>
      </div>
    </div>
  );
};

export default ScouterAI;