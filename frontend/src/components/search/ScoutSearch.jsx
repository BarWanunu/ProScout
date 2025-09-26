import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import DirectTeamSearch from "@/components/search/DirectTeamSearch";
import PlayerSearchPanel from "@/components/search/PlayerSearchPanel";
import { SearchResultsList } from "@/components/search";
import { ScoutProfile, TeamProfile } from "@/components/profile";
import searchService from "@/api/services/searchService";
import useProfileNavigation from "@/hooks/useProfileNavigation";
import "@/components/search/styles/SearchBox.css";
import "@/components/search/styles/SearchFixGlobal.css";
import "@/components/search/styles/DirectSearchStyles.css";


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

  // Profile navigation
  const { 
    currentProfile,
    navigateToProfile,
    goBack,
    isProfileOpen 
  } = useProfileNavigation();

  // Render current profile
  const renderProfile = () => {
    if (!currentProfile) return null;

    switch (currentProfile.type) {
      case 'scout':
        return (
          <ScoutProfile
            scoutId={currentProfile.id}
            onBack={goBack}
            onNavigateToProfile={navigateToProfile}
          />
        );
      case 'team':
        return (
          <TeamProfile
            teamId={currentProfile.id}
            onBack={goBack}
            onNavigateToProfile={navigateToProfile}
          />
        );
      default:
        return (
          <div className="text-center p-4">
            <h3>Profile type not supported</h3>
            <Button variant="primary" onClick={goBack}>
              Go Back
            </Button>
          </div>
        );
    }
  };

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
    <>
      {/* Show profile if one is open */}
      {isProfileOpen && renderProfile()}
      
      {/* Show search interface when no profile is open */}
      {!isProfileOpen && (
        <div className="scout-search-box search-component-wrapper">
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
        onNavigateToProfile={navigateToProfile}
      />
    </div>
      )}
    </>
  );
}