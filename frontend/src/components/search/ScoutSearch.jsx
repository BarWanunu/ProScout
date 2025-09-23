import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import AdvancedSearchTeam from "@/components/search/AdvancedSearchTeam";
import PlayerSearchPanel from "@/components/search/PlayerSearchPanel";
import { SearchResultsList } from "@/components/search";
import searchService from "@/api/services/searchService";  
import "@/components/search/SearchBox.css";

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
  const [hasSearched, setHasSearched] = useState(false);

  // Reset all filters when searchType changes
  useEffect(() => {
    // Reset search input
    setSearchInput("");
    
    // Reset team filters
    setLeague("");
    setCountry("");
    setFormation("");
    
    // Reset player filters
    setPlayerFilters({});
    setStatsFilters({});
    setSearchMode("profile");
    
    // Clear results
    setResults([]);
    setHasSearched(false);
  }, [searchType]);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setHasSearched(true);

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
          onChange={handleSearchTypeChange}
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
          key="team-search-panel"
          league={league}
          setLeague={setLeague}
          country={country}
          setCountry={setCountry}
          formation={formation}
          setFormation={setFormation}
          onSearch={handleSearch}
        />
      )}

      {searchType === "player" && (
        <PlayerSearchPanel
          key="player-search-panel"
          onPlayerFiltersChange={setPlayerFilters}
          onStatsFiltersChange={setStatsFilters}
          onSearchModeChange={setSearchMode}
          onSearch={handleSearch}
        />
      )}

      <Button
        variant="primary"
        className="search-button"
        onClick={handleSearch}
      >
        {loading ? "Searching..." : "Search"}
      </Button>

      {/* --- Results --- */}
      <SearchResultsList 
        results={results}
        loading={loading}
        hasSearched={hasSearched}
        searchType={searchType}
      />
    </div>
  );
}