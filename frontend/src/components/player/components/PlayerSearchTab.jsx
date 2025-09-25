import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import DirectScoutSearch from "@/components/search/DirectScoutSearch";
import DirectTeamSearch from "@/components/search/DirectTeamSearch";
import { SearchResultsList } from "@/components/search";
import searchService from "@/api/services/searchService";
import "@/components/search/styles/SearchBox.css";
import "@/components/search/styles/SearchFixGlobal.css";
import "@/components/search/styles/DirectSearchStyles.css";

export default function PlayerSearchTab({ player }) {
  const [searchType, setSearchType] = useState("team"); // Start with team search
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Team search filters
  const [league, setLeague] = useState("");
  const [country, setCountry] = useState("");
  const [formation, setFormation] = useState("");

  // Scout search filters
  const [scoutFilters, setScoutFilters] = useState({});

  // Reset all filters when searchType changes
  useEffect(() => {
    setSearchInput("");
    setLeague("");
    setCountry("");
    setFormation("");
    setScoutFilters({});
    setSearchResults([]);
    setHasSearched(false);
  }, [searchType]);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      let results = [];
      
      if (searchType === "team") {
        if (league || country || formation) {
          // Advanced team search
          const filters = { team_name: searchInput, league, country, formation };
          const res = await searchService.advancedSearchTeams(filters);
          results = res.data || [];
        } else {
          // Simple team search by name
          const res = await searchService.searchTeamsByName(searchInput);
          results = res.data || [];
        }
      } else if (searchType === "scout") {
        // For scout search - always use advanced search
        // If no filters and no search input, it will return all scouts
        const filters = { ...scoutFilters };
        if (searchInput.trim()) {
          filters.name = searchInput;
        }
        const res = await searchService.advancedSearchScouts(filters);
        results = res.data || [];
      }

      setSearchResults(results);
      console.log(`✅ ${searchType} search results:`, results);
    } catch (err) {
      console.error(`❌ Error searching ${searchType}s:`, err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="player-search-tab">
      <div className="scout-search-box search-component-wrapper">
        <div className="search-header">
          <select
            className="search-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="team">Search by Team</option>
            <option value="scout">Search by Scout</option>
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
          <DirectTeamSearch
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

        {searchType === "scout" && (
          <DirectScoutSearch
            key="scout-search-panel"
            filters={scoutFilters}
            setFilters={setScoutFilters}
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


        {/* Search Results */}
        <SearchResultsList 
          results={searchResults}
          loading={loading}
          hasSearched={hasSearched}
          searchType={searchType}
          playerData={player}
        />
      </div>
    </div>
  );
}