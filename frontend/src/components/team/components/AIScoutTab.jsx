import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';
import { Info, Target, ChevronUp, ChevronDown, Users } from 'lucide-react';
import recommendationService from '@/api/services/recommendationSystemService';
import ScouterAI from './SmartSearch';
import defaultAvatar from '@/assets/default-player.png';
import '../styles/AIScoutTab.css';

// Radar categories
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

// Local helper to format similarity percentage
const fmtSimilarity = (s) => typeof s === 'number' ? (s * 100).toFixed(1) + '%' : '—';

export default function AIScoutTab() {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');
  const [rowImgs, setRowImgs] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [hiddenPlayers, setHiddenPlayers] = useState(new Set());

  const { data: options, isLoading: loadingPlayers } = useQuery({
    queryKey: ['playersForSearch'],
    queryFn: async () => {
      const players = await recommendationService.getAllPlayers();
      return players.map(p => ({ value: p.rk, label: p.player }));
    },
  });

  const radarData = useMemo(() => {
    if (!data?.recommendations) return [];
    return RADAR_CATEGORIES.map(metric => {
      const row = { metric };
      data.recommendations.forEach(p => { if(!hiddenPlayers.has(p.player)) row[p.player] = Number(p[metric]) || 0; });
      return row;
    });
  }, [data, hiddenPlayers]);

  const buildPhotoUrl = (playerObj) => {
    if (!playerObj) return '';
    if (playerObj.photo && playerObj.photo.startsWith('http')) return playerObj.photo;
    if (playerObj.photo) return `${import.meta.env.VITE_API_BASE_URL}/${playerObj.photo}`;
    // Attempt pattern: if a numeric id embedded in rk or a separate id property (not provided here) you could adapt
    return '';
  };

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
      // Prefer direct DB photo if present, else fallback to wiki service
      const directPhoto = buildPhotoUrl(result.selectedPlayer);
      if (directPhoto) {
        setSelectedImg(directPhoto);
      } else {
        try {
          const imgRes = await recommendationService.getPlayerImage?.({ name: result.selectedPlayer.player, squad: result.selectedPlayer.squad });
          if (imgRes?.url) setSelectedImg(imgRes.url);
        } catch {}
      }
      if (result?.recommendations?.length) {
        const entries = await Promise.all(result.recommendations.slice(0, 10).map(async p => {
          // For each recommendation attempt direct DB photo first
          const direct = buildPhotoUrl(p);
          if (direct) return [p.rk, direct];
          try {
            const r = await recommendationService.getPlayerImage?.({ name: p.player, squad: p.squad });
            return [p.rk, r?.url || ''];
          } catch { return [p.rk, '']; }
        }));
        setRowImgs(Object.fromEntries(entries));
      }
    } catch (e) {
      console.error('Failed to fetch similar players', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlayer = data?.selectedPlayer;

  const formatValue = (val) => {
    if (val === null || val === undefined || val === '') return '—';
    if (typeof val === 'number') return (val % 1 === 0) ? String(val) : val.toFixed(1);
    return String(val);
  };

  return (
    <div className="ai-scout-tab ai-scout-light">
      <div className="aiscout-inner">
        <div className="aiscout-header-light">
          <h2 className="page-title">Player Scouting Recommendation System</h2>
          <p className="subtitle">Pick a player to explore a profile feature breakdown and discover the top 10 statistically similar players.</p>
        </div>

        <div className="controls">
          <Select
            classNamePrefix="react-select"
            isLoading={loadingPlayers}
            options={options}
            value={selected}
            onChange={onSelect}
            placeholder="Search a player by name..."
            noOptionsMessage={() => loadingPlayers ? 'Loading players…' : 'No players found'}
          />
        </div>

        {loading && (
          <div className="loading-row" aria-live="polite">
            <div className="mini-spinner" />
            <span className="loading-text">Analyzing & finding similar players…</span>
          </div>
        )}

        {selectedPlayer ? (
          <div className={`feature-card ${collapsed ? 'is-collapsed' : ''}`}> 
            <div className="feature-card-header">
              <h4 className="card-title">Player Feature Overview</h4>
              <button className="collapse-btn" onClick={() => setCollapsed(c => !c)} aria-label={collapsed ? 'Expand details' : 'Collapse details'}>
                {collapsed ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
              </button>
            </div>
            {!collapsed && (
              <div className="feature-card-body">
                <div className="player-identity">
                  <div className="photo-wrapper">
                    <img className="main-photo" src={selectedImg || defaultAvatar} alt={selectedPlayer.player} onError={(e) => { e.currentTarget.src = defaultAvatar; }} />
                  </div>
                  <div className="identity-meta">
                    <h3 className="player-name" title={selectedPlayer.player}>{selectedPlayer.player}</h3>
                    <div className="mini-tags">
                      <span className="tag">Pos: {selectedPlayer.position || selectedPlayer.pos}</span>
                      <span className="tag">Age: {formatValue(selectedPlayer.age)}</span>
                      <span className="tag">Nation: {formatValue(selectedPlayer.nationality || selectedPlayer.nation)}</span>
                      <span className="tag">Club: {formatValue(selectedPlayer.club || selectedPlayer.squad)}</span>
                    </div>
                  </div>
                </div>
                <div className="player-stats-groups">
                  {selectedPlayer?.statsLatest && (
                    <div className="group">
                      <div className="group-heading"><Info size={14} /> <span>Latest Season</span></div>
                      <div className="stats-grid four-col">
                        {/* Position specific blocks mirroring TeamSearch PlayerProfile */}
                        {(() => {
                          const latest = selectedPlayer.statsLatest;
                          const pos = (selectedPlayer.position || selectedPlayer.pos || '').toLowerCase();
                          if (pos.includes('goalkeeper') || pos === 'gk') {
                            return (
                              <>
                                <div className="stat"><span className="label">Rating</span><span className="value">{formatValue(latest.rating)}</span></div>
                                <div className="stat"><span className="label">Passes Completed</span><span className="value">{formatValue(latest.passes_completed)}</span></div>
                                <div className="stat"><span className="label">Yellow Cards</span><span className="value">{formatValue(latest.yellow_cards)}</span></div>
                                <div className="stat"><span className="label">Red Cards</span><span className="value">{formatValue(latest.red_cards)}</span></div>
                              </>
                            );
                          }
                          if (pos.includes('defender') || pos.startsWith('df')) {
                            return (
                              <>
                                <div className="stat"><span className="label">Rating</span><span className="value">{formatValue(latest.rating)}</span></div>
                                <div className="stat"><span className="label">Tackles</span><span className="value">{formatValue(latest.tackles)}</span></div>
                                <div className="stat"><span className="label">Interceptions</span><span className="value">{formatValue(latest.interceptions)}</span></div>
                                <div className="stat"><span className="label">Duels</span><span className="value">{formatValue(latest.duels_won)}/{formatValue(latest.duels)}</span></div>
                                <div className="stat"><span className="label">Yellow Cards</span><span className="value">{formatValue(latest.yellow_cards)}</span></div>
                                <div className="stat"><span className="label">Red Cards</span><span className="value">{formatValue(latest.red_cards)}</span></div>
                              </>
                            );
                          }
                          if (pos.includes('midfielder') || pos.startsWith('mf')) {
                            return (
                              <>
                                <div className="stat"><span className="label">Rating</span><span className="value">{formatValue(latest.rating)}</span></div>
                                <div className="stat"><span className="label">Passes</span><span className="value">{formatValue(latest.passes_completed)}</span></div>
                                <div className="stat"><span className="label">Key Passes</span><span className="value">{formatValue(latest.key_passes)}</span></div>
                                <div className="stat"><span className="label">Assists</span><span className="value">{formatValue(latest.assists)}</span></div>
                                <div className="stat"><span className="label">Dribbles</span><span className="value">{formatValue(latest.dribbles_success)}/{formatValue(latest.dribbles_attempted)}</span></div>
                                <div className="stat"><span className="label">Yellow Cards</span><span className="value">{formatValue(latest.yellow_cards)}</span></div>
                              </>
                            );
                          }
                          if (pos.includes('forward') || pos.includes('attacker') || pos.startsWith('fw')) {
                            return (
                              <>
                                <div className="stat"><span className="label">Rating</span><span className="value">{formatValue(latest.rating)}</span></div>
                                <div className="stat"><span className="label">Goals</span><span className="value">{formatValue(latest.goals)}</span></div>
                                <div className="stat"><span className="label">Assists</span><span className="value">{formatValue(latest.assists)}</span></div>
                                <div className="stat"><span className="label">Shots on Target</span><span className="value">{formatValue(latest.shots_on_target)}</span></div>
                                <div className="stat"><span className="label">Dribbles</span><span className="value">{formatValue(latest.dribbles_success)}/{formatValue(latest.dribbles_attempted)}</span></div>
                                <div className="stat"><span className="label">Yellow Cards</span><span className="value">{formatValue(latest.yellow_cards)}</span></div>
                              </>
                            );
                          }
                          // fallback: show a minimal generic subset
                          return (
                            <>
                              <div className="stat"><span className="label">Rating</span><span className="value">{formatValue(latest.rating)}</span></div>
                              <div className="stat"><span className="label">Yellow Cards</span><span className="value">{formatValue(latest.yellow_cards)}</span></div>
                              <div className="stat"><span className="label">Goals</span><span className="value">{formatValue(latest.goals)}</span></div>
                              <div className="stat"><span className="label">Assists</span><span className="value">{formatValue(latest.assists)}</span></div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" aria-live="polite">
            <p>Select a player to view detailed attributes and similarity comparisons.</p>
          </div>
        )}

        {data && (
          <section className="similar-section">
            <div className="section-top">
              <h4 className="section-title">Top 10 Similar Players to {selectedPlayer.player}</h4>
              <span className="section-hint">Similarity derived from normalized multi-feature embeddings</span>
            </div>
            <div className="similar-grid">
              <div className="similar-table-card">
                <table className="similar-table" role="table">
                  <thead>
                    <tr>
                      <th scope="col">Player</th>
                      <th scope="col">Nation</th>
                      <th scope="col">Squad</th>
                      <th scope="col">Pos</th>
                      <th scope="col">Age</th>
                      <th scope="col">Similarity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recommendations.map(p => (
                      <tr key={p.rk}>
                        <td>
                          <div className="player-cell" title={p.player}>
                            <img className="thumb" src={rowImgs[p.rk] || defaultAvatar} alt={p.player} onError={(e) => { e.currentTarget.src = defaultAvatar; }} />
                            <span className="truncate">{p.player}</span>
                          </div>
                        </td>
                        <td>{p.nationality || p.nation}</td>
                        <td>{p.club || p.squad}</td>
                        <td>{p.position || p.pos}</td>
                        <td>{p.age}</td>
                        <td><span className="sim-badge" title="Cosine similarity">{fmtSimilarity(p.similarity)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="similar-radar-card">
                <div className="radar-header">
                  <h5>Attribute Comparison</h5>
                  <span className="hint">Toggle a player in legend to hide</span>
                </div>
                <div className="radar-shell">
                  <ResponsiveContainer width="100%" height={360}>
                    <RadarChart cx="50%" cy="52%" outerRadius="70%" data={radarData}>
                      <PolarGrid radialLines={false} stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#334155', fontSize: 11 }} />
                      <PolarRadiusAxis angle={18} domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 10 }} stroke="#cbd5e1" />
                      {data.recommendations.map((p, i) => {
                        const color = `hsl(${(i * 28) % 360}, 70%, 47%)`;
                        if(hiddenPlayers.has(p.player)) return null;
                        return (
                          <Radar
                            key={p.rk}
                            name={p.player}
                            dataKey={p.player}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.18}
                            strokeWidth={2}
                          />
                        );
                      })}
                      <Legend wrapperStyle={{ fontSize: 11 }} onClick={(e) => {
                        if(!e || !e.value) return;
                        setHiddenPlayers(prev => {
                          const next = new Set(prev);
                          if(next.has(e.value)) next.delete(e.value); else next.add(e.value);
                          return next;
                        });
                      }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {data && (
          <div className="scouter-ai-section">
            <ScouterAI data={data} />
          </div>
        )}
      </div>{/* /.aiscout-inner */}
    </div>
  );
}