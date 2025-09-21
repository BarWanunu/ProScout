import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import AdvancedSearchTeam from "./AdvancedSearchTeam";
import PlayerSearchPanel from "./PlayerSearchPanel";
import searchService from "@/api/services/searchService";  // 👈 חיבור ל-service
import "../styles/ScoutSearch.css";

export default function ScoutSearch() {
  const [searchType, setSearchType] = useState("player");
  const [searchInput, setSearchInput] = useState("");

  const [league, setLeague] = useState("");
  const [country, setCountry] = useState("");
  const [formation, setFormation] = useState("");

  const [playerFilters, setPlayerFilters] = useState({});
  const [statsFilters, setStatsFilters] = useState({});
  const [searchMode, setSearchMode] = useState("profile");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);

      if (searchType === "team") {
        if (league || country || formation) {
          // advanced search
          const filters = { team_name: searchInput, league, country, formation };
          const res = await searchService.advancedSearchTeams(filters);
          setResults(res.data || res);
            console.log(res.data);
        } else {
          // simple search by name
          const res = await searchService.searchTeamsByName(searchInput);
          setResults(res.data || res);
            console.log(res.data);
        }
      } else {
        // --- player search ---
        if (searchMode === "stats") {
          const filters = { ...statsFilters, name: searchInput };
          const res = await searchService.searchPlayersWithStats(filters);
          setResults(res.data || res);
                      console.log(res.data);

        } else {
          const filters = { ...playerFilters, name: searchInput };
          const res = await searchService.advancedSearchPlayers(filters);
          setResults(res.data || res);
                      console.log(res.data);

        }
      }
    } catch (err) {
      console.error("❌ Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scout-search-box">
      <div className="search-header">
        <select
          className="search-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="player">Search by Player</option>
          <option value="team">Search by Team</option>
        </select>

        {(searchType === "team" || (searchType === "player" && searchMode === "profile")) && (
          <div className="main-input-wrapper">
            <Form.Control
              type="text"
              placeholder={`Enter ${searchType} name`}
              className="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
        )}
      </div>

      {searchType === "team" && (
        <AdvancedSearchTeam
          league={league}
          setLeague={setLeague}
          country={country}
          setCountry={setCountry}
          formation={formation}
          setFormation={setFormation}
        />
      )}

      {searchType === "player" && (
        <PlayerSearchPanel
          onPlayerFiltersChange={setPlayerFilters}
          onStatsFiltersChange={setStatsFilters}
          onSearchModeChange={setSearchMode}
        />
      )}

      <Button
        variant="primary"
        className="search-button"
        onClick={handleSearch}
      >
        {loading ? "Searching..." : "Search"}
      </Button>

      {/* --- תוצאות --- */}
      <div className="search-results mt-4 text-black">
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <ul>
            {results.map((item, i) => (
              <li key={i}>
                {searchType === "team"
                  ? `${item.team_name} (${item.country}, ${item.league}, ${item.formation}, ${item.stadium}, ${item.trophies})`
                  : `${item.name} - ${item.goals || "?"} - ${item.season} (${item.club || "?"})`}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No results found</p>
        )}
      </div>
    </div>
  );
}
