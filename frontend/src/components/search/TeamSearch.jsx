import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import DirectScoutSearch from "./DirectScoutSearch";
import PlayerSearchPanel from "./PlayerSearchPanel";
import { SearchResultsList } from "@/components/search";
import searchService from "@/api/services/searchService";  
import "@/components/search/styles/SearchBox.css";
import "@/components/search/styles/SearchFixGlobal.css";
import "@/components/search/styles/SearchFixTeam.css";
import "@/components/search/styles/DirectSearchStyles.css";

export default function TeamSearch() {
  const [searchType, setSearchType] = useState("player");
  const [searchInput, setSearchInput] = useState("");

  const [playerFilters, setPlayerFilters] = useState({});
  const [statsFilters, setStatsFilters] = useState({});
  const [searchMode, setSearchMode] = useState("profile");

  // Scout filters
  const [scoutFilters, setScoutFilters] = useState({});

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset all filters when searchType changes
  useEffect(() => {
    // Reset search input
    setSearchInput("");
    
    // Reset player filters
    setPlayerFilters({});
    setStatsFilters({});
    setSearchMode("profile");
    
    // Reset scout filters
    setScoutFilters({});
    
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

      if (searchType === "player") {
        // Player search
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
      } else if (searchType === "scout") {
        // Scout search
        const filters = { ...scoutFilters, name: searchInput };
        const res = await searchService.advancedSearchScouts(filters);
        setResults(res.data || res);
        console.log(res.data);
      }
    } catch (err) {
      console.error("❌ Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scout-search-box search-component-wrapper team-search">
      <div className="search-header">
        <select
          className="search-select"
          value={searchType}
          onChange={handleSearchTypeChange}
        >
          <option value="player">Search by Player</option>
          <option value="scout">Search by Scout</option>
        </select>

        {(searchType === "scout" || (searchType === "player" && searchMode === "profile")) && (
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

      {searchType === "scout" && (
        <DirectScoutSearch
          key="scout-search-panel"
          filters={scoutFilters}
          setFilters={setScoutFilters}
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