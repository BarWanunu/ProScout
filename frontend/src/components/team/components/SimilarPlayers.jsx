import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';
import '../styles/SimilarPlayers.css';

// Stats for the radar chart
const RADAR_CATEGORIES = ['performance_gls', 'performance_ast', 'kp', 'gca_gca', 'aerial_duels_won', 'int', 'tackles_tklw', 'performance_saves', 'performance_cs', 'performance_ga', 'performance_sota'];

const SimilarPlayers = ({ data }) => {
  const { selectedPlayer, recommendations } = data;

  const radarData = recommendations.map(player => {
    const playerRadarStats = { subject: player.player };
    RADAR_CATEGORIES.forEach(cat => {
      playerRadarStats[cat] = player[cat] || 0;
    });
    return playerRadarStats;
  });

  return (
    <div className="similar-players-container">
      <h3>Top 10 Similar Players to {selectedPlayer.player}</h3>
      <div className="content-wrapper">
        <div className="player-list">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Nation</th>
                <th>Squad</th>
                <th>Pos</th>
                <th>Age</th>
                <th>Similarity</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map(p => (
                <tr key={p.rk}>
                  <td>{p.player}</td>
                  <td>{p.nation}</td>
                  <td>{p.squad}</td>
                  <td>{p.pos}</td>
                  <td>{p.age}</td>
                  <td>{(p.similarity * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="radar-chart">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              {recommendations.map((player, index) => (
                 <Radar key={player.rk} name={player.player} dataKey={player.player} stroke={`hsl(${index * 36}, 70%, 50%)`} fill={`hsl(${index * 36}, 70%, 50%)`} fillOpacity={0.6} />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SimilarPlayers;