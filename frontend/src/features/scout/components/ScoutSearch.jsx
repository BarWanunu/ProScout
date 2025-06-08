import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import AdvancedSearchTeam from "./AdvancedSearchTeam";
import PlayerSearchPanel from "./PlayerSearchPanel";
import "../styles/ScoutSearch.css";

export default function ScoutSearch() {
  const [searchType, setSearchType] = useState("player");
  const [searchInput, setSearchInput] = useState("");

  const [league, setLeague] = useState("");
  const [country, setCountry] = useState("");
  const [formation, setFormation] = useState("");

  const [playerFilters, setPlayerFilters] = useState({});
  const [statsFilters, setStatsFilters] = useState({});
  const [searchMode, setSearchMode] = useState("profile"); // "profile" | "stats"

  const handleSearch = () => {
    if (searchType === "team") {
      alert(`🔎 Search Team:
      Name: ${searchInput}
      League: ${league}
      Country: ${country}
      Formation: ${formation}`);
    } else {
      const filters =
        searchMode === "profile" ? playerFilters : statsFilters;

      alert(`🔎 Search Player:
      Name: ${searchInput}
      Filters: ${JSON.stringify(filters, null, 2)}`);
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
        Search
      </Button>
    </div>
  );
}
