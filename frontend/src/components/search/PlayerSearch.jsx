import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { SearchResultsList } from "@/components/search";
import searchService from "@/api/services/searchService";
import "@/components/search/SearchBox.css";

export default function PlayerSearch() {
  const [searchType, setSearchType] = useState("team");
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchInput("");
    setResults([]);
    setHasSearched(false);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setHasSearched(true);

      if (searchType === "team") {
        // Search for teams
        const res = await searchService.searchTeamsByName(searchInput);
        setResults(res.data || res);
      } else if (searchType === "scout") {
        // Search for scouts
        const res = await searchService.searchScoutsByName(searchInput);
        setResults(res.data || res);
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

      <Button
        variant="primary"
        className="search-button"
        onClick={handleSearch}
      >
        {loading ? "Searching..." : "Search"}
      </Button>

      <SearchResultsList 
        results={results}
        loading={loading}
        hasSearched={hasSearched}
        searchType={searchType}
      />
    </div>
  );
}