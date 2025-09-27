import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';
import recommendationService from '@/api/services/recommendationSystemService';
import ScouterAI from './SmartSearch';
import defaultAvatar from '@/assets/default-player.png';
import '../styles/PlayerRecommendationSystem.css';
import '../styles/AIScoutTab.css';

// Stats for the radar chart as used in app_solr.py mapping
const RADAR_CATEGORIES = [
  'performance_gls',
  'performance_ast',
  'kp',
  'gca_gca',
  'aerial_duels_won',
  'int',
  'tackles_tklw',
  'performance_saves',
  'performance_cs',
  'performance_ga',
  'performance_sota',
];

export default function AIScoutTab() {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');
  const [rowImgs, setRowImgs] = useState({});

  const { data: options, isLoading: loadingPlayers } = useQuery({
    queryKey: ['playersForSearch'],
    queryFn: async () => {
      const players = await recommendationService.getAllPlayers();
      return players.map(p => ({ value: p.rk, label: p.player }));
    },
  });

  const radarData = useMemo(() => {
    if (!data?.recommendations) return [];
    // Build an array of objects: { metric, [playerName]: value, ... }
    const rows = RADAR_CATEGORIES.map(metric => {
      const row = { metric };
      data.recommendations.forEach(p => {
        row[p.player] = Number(p[metric]) || 0;
      });
      return row;
    });
    return rows;
  }, [data]);

  const onSelect = async (opt) => {
    setSelected(opt);
    setData(null);
    setSelectedImg('');
    setRowImgs({});
    if (!opt) return;
    setLoading(true);
    try {
      const result = await recommendationService.getSimilarPlayers(opt.value);
      setData(result);
      // Try to fetch image for selected player
      try {
        const imgRes = await recommendationService.getPlayerImage?.({ name: result.selectedPlayer.player, squad: result.selectedPlayer.squad });
        if (imgRes?.url) setSelectedImg(imgRes.url);
      } catch {
        // image lookup failed or endpoint not configured
      }
      // Fetch images for each recommended player in background
      if (result?.recommendations?.length) {
        const promises = result.recommendations.slice(0, 10).map(async (p) => {
          try {
            const r = await recommendationService.getPlayerImage?.({ name: p.player, squad: p.squad });
            return [p.rk, r?.url || ''];
          } catch {
            return [p.rk, ''];
          }
        });
        const entries = await Promise.all(promises);
        setRowImgs(Object.fromEntries(entries));
      }
    } catch (e) {
      console.error('Failed to fetch similar players', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-scout-tab">
      <h3>Player Scouting Recommendation System</h3>
      <p>Pick a player to find the top 10 statistically similar profiles.</p>

      <div className="controls">
        <Select
          classNamePrefix="react-select"
          className="player-search-select"
          placeholder="Search a player..."
          isClearable
          isLoading={loadingPlayers}
          value={selected}
          onChange={onSelect}
          options={options}
        />
      </div>

      {loading && <div className="loading-spinner">Finding similar players…</div>}

      {data && (
        <div className="results">
          <div className="results-header">
            <div className="selected-card">
              <img className="selected-photo" src={selectedImg || defaultAvatar} alt={data.selectedPlayer.player} onError={(e) => { e.currentTarget.src = defaultAvatar; }} />
              <div>
                <h4>Top 10 Similar Players to {data.selectedPlayer.player}</h4>
                <div className="selected-meta">
                  <span>Nation: {data.selectedPlayer.nation}</span>
                  <span>Squad: {data.selectedPlayer.squad}</span>
                  <span>Pos: {data.selectedPlayer.pos}</span>
                  <span>Age: {data.selectedPlayer.age}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="table-wrap">
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
                  {data.recommendations.map(p => (
                    <tr key={p.rk}>
                      <td>
                        <div className="player-cell">
                          <img className="thumb" src={rowImgs[p.rk] || defaultAvatar} alt={p.player} onError={(e) => { e.currentTarget.src = defaultAvatar; }} />
                          <span>{p.player}</span>
                        </div>
                      </td>
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

            <div className="radar-wrap">
              <h5>Attribute Comparison</h5>
              <ResponsiveContainer width="100%" height={420}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  {data.recommendations.map((p, i) => (
                    <Radar
                      key={p.rk}
                      name={p.player}
                      dataKey={p.player}
                      stroke={`hsl(${(i * 36) % 360}, 70%, 45%)`}
                      fill={`hsl(${(i * 36) % 360}, 70%, 45%)`}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              <div className="radar-legend-note">Metrics are min-max scaled across the dataset.</div>
            </div>
          </div>
        </div>
      )}

      {data && (
        <div className="scouter-ai-section">
          <ScouterAI data={data} />
        </div>
      )}
    </div>
  );
}