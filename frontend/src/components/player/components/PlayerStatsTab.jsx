import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';
import playerService from '@/api/services/playerService';
import { useAuth } from '@/auth/AuthContext';
import '../../team/styles/ShortlistTab.css';
import '../styles/PlayerStatsTabNew.css';

const PlayerStatsTab = ({ player }) => {
  const [stats, setStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [yearRange, setYearRange] = useState({ from: '', to: '' });
  const [filterType, setFilterType] = useState('all');

  const years = [2020, 2021, 2022, 2023, 2024];

  const fetchPlayerStats = async () => {
    if (!player?.id) return;
    try {
      setLoading(true);
      const response = await playerService.getPlayerStats(player.id);
      setStats(response?.stats || []);
    } catch (error) {      
        console.error('Error fetching player stats:', error);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (player && player.id) fetchPlayerStats();
  }, [player?.id]);

  const applyFilters = () => {
    if (!stats || stats.length === 0) {
      setFilteredStats([]);
      return;
    }

    let result = [...stats];

    // helper to get season/year from stat object (handles different backend shapes)
    const getSeason = (s) => s?.season ?? s?.year ?? s?.season_year ?? s?.seasonYear ?? null;

    if (filterType === 'year') {
      if (selectedYear && selectedYear !== 'all') {
        result = result.filter((s) => String(getSeason(s)) === String(selectedYear));
      }
    } else if (filterType === 'range') {
      const from = parseInt(yearRange.from, 10);
      const to = parseInt(yearRange.to, 10);
      if (!isNaN(from) && !isNaN(to)) {
        result = result.filter((s) => {
          const season = parseInt(getSeason(s), 10);
          return !isNaN(season) && season >= from && season <= to;
        });
      } else if (!isNaN(from)) {
        result = result.filter((s) => {
          const season = parseInt(getSeason(s), 10);
          return !isNaN(season) && season >= from;
        });
      } else if (!isNaN(to)) {
        result = result.filter((s) => {
          const season = parseInt(getSeason(s), 10);
          return !isNaN(season) && season <= to;
        });
      }
    }

    setFilteredStats(result);
  };

  useEffect(() => {
    applyFilters();
  }, [stats, selectedYear, yearRange, filterType]);

  const calculateAllStats = () => {
    if (filteredStats.length === 0) return null;
    let ratingSum = 0;
    let ratingCount = 0;
    const totals = filteredStats.reduce((acc, stat) => {
      // coerce rating to number if possible (handles strings from API)
      const r = stat && stat.rating != null ? parseFloat(stat.rating) : NaN;
      if (!isNaN(r)) {
        ratingSum += r;
        ratingCount += 1;
      }
      return {
        goals: acc.goals + (stat.goals || 0),
        assists: acc.assists + (stat.assists || 0),
        yellow_cards: acc.yellow_cards + (stat.yellow_cards || 0),
        red_cards: acc.red_cards + (stat.red_cards || 0),
        passes_completed: acc.passes_completed + (stat.passes_completed || 0),
        key_passes: acc.key_passes + (stat.key_passes || 0),
        shots_on_target: acc.shots_on_target + (stat.shots_on_target || 0),
        dribbles_attempted: acc.dribbles_attempted + (stat.dribbles_attempted || 0),
        dribbles_success: acc.dribbles_success + (stat.dribbles_success || 0),
        tackles: acc.tackles + (stat.tackles || 0),
        interceptions: acc.interceptions + (stat.interceptions || 0),
        duels: acc.duels + (stat.duels || 0),
        duels_won: acc.duels_won + (stat.duels_won || 0),
        seasons: acc.seasons + 1
      };
    }, {
      goals: 0, assists: 0, yellow_cards: 0, red_cards: 0,
      passes_completed: 0, key_passes: 0, shots_on_target: 0,
      dribbles_attempted: 0, dribbles_success: 0, tackles: 0,
      interceptions: 0, duels: 0, duels_won: 0, seasons: 0
    });
    // ממוצע rating רק לעונות שיש להן rating
  const avgRating = ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(1)) : null;
    const dribbleSuccessRate = totals.dribbles_attempted > 0 ? 
      ((totals.dribbles_success / totals.dribbles_attempted) * 100).toFixed(1) : 0;
    const duelSuccessRate = totals.duels > 0 ? 
      ((totals.duels_won / totals.duels) * 100).toFixed(1) : 0;

    return {
      ...totals,
      avgRating: avgRating,
      ratingCount,
      dribbleSuccessRate: dribbleSuccessRate,
      duelSuccessRate: duelSuccessRate
    };
  };

  const renderFilterControls = () => (
    <div className="player-card-extended">
      <div className="filter-type-selector">
        <button
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          <Calendar size={16} />
          All Time
        </button>
        <button
          className={`filter-btn ${filterType === 'year' ? 'active' : ''}`}
          onClick={() => setFilterType('year')}
        >
          <Filter size={16} />
          Specific Year
        </button>
        <button
          className={`filter-btn ${filterType === 'range' ? 'active' : ''}`}
          onClick={() => setFilterType('range')}
        >
          <TrendingUp size={16} />
          Year Range
        </button>
      </div>

      {filterType === 'year' && (
        <div className="year-selector">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="year-select"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {filterType === 'range' && (
        <div className="range-selector">
          <select
            value={yearRange.from}
            onChange={(e) => setYearRange(prev => ({ ...prev, from: e.target.value }))}
            className="range-select"
          >
            <option value="">From Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <span className="range-separator">to</span>
          <select
            value={yearRange.to}
            onChange={(e) => setYearRange(prev => ({ ...prev, to: e.target.value }))}
            className="range-select"
          >
            <option value="">To Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderStatCard = (title, value, suffix = '') => {
    // handle numeric strings as numbers for display
    const numeric = typeof value === 'number' ? value : (!isNaN(Number(value)) ? Number(value) : null);
    const display = numeric !== null ? (Number.isInteger(numeric) ? numeric : numeric.toFixed(1)) : value;
    return (
      <div className="stat-item">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{display}{suffix}</span>
      </div>
    );
  };

  const renderAllStats = () => {
    const allStats = calculateAllStats();
    if (!allStats) return null;

  // Show rating if avgRating is a valid number
  const showRating = typeof allStats.avgRating === 'number' && !isNaN(allStats.avgRating);

    return (
      <div className="player-card-extended">
        <div className="player-stats-grid stats-center-last-row">
          {renderStatCard('Goals', allStats.goals)}
          {renderStatCard('Assists', allStats.assists)}
          {renderStatCard('Shots on Target', allStats.shots_on_target)}
          {renderStatCard('Key Passes', allStats.key_passes)}
          {renderStatCard('Passes Completed', allStats.passes_completed)}
          {renderStatCard('Dribbles Attempted', allStats.dribbles_attempted)}
          {renderStatCard('Dribbles Successful', allStats.dribbles_success)}
          {renderStatCard('Dribble Success', allStats.dribbleSuccessRate, '%')}
          {renderStatCard('Tackles', allStats.tackles)}
          {renderStatCard('Interceptions', allStats.interceptions)}
          {renderStatCard('Duels', allStats.duels)}
          {renderStatCard('Duels Won', allStats.duelSuccessRate, '%')}
          {showRating && renderStatCard('Average Rating', allStats.avgRating, '')}
          {renderStatCard('Yellow Cards', allStats.yellow_cards)}
          {renderStatCard('Red Cards', allStats.red_cards)}
          {renderStatCard('Seasons Played', allStats.seasons)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="shortlist-empty">
        <div className="player-card-extended text-center">
          <BarChart3 size={48} className="mb-3 text-white" />
          <p className="text-white mb-0">Loading player statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats.length) {
    return (
      <div className="shortlist-empty">
        <div className="player-card-extended text-center">
          <BarChart3 size={64} className="mb-3 text-white" />
          <h3 className="text-white">No Statistics Available</h3>
          <p className="text-white mb-0">Player statistics will appear here once available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player-stats-tab">
      <div className="shortlist-header">
        <h4 className="text-white">Player Statistics</h4>
        <p className="text-white mb-0">Detailed performance data and season analysis</p>
      </div>

      {renderFilterControls()}
      
      {filteredStats.length > 0 ? (
        <>
          {renderAllStats()}
        </>
      ) : (
        <div className="shortlist-empty">
          <div className="player-card-extended text-center">
            <BarChart3 size={48} className="mb-3 text-white" />
            <h3 className="text-white">No Statistics Found</h3>
            <p className="text-white mb-0">No data available for the selected time period.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsTab;