import { useState, useEffect } from "react";
import PlayerSearchToggle from "@/components/search/PlayerSearchToggle";
import PlayerProfileSearch from "@/components/search/PlayerProfileSearch";
import PlayerStatsSearch from "@/components/search/PlayerStatsSearch";

export default function PlayerSearchPanel({
  onPlayerFiltersChange,
  onStatsFiltersChange,
  onSearchModeChange,
  onSearch,
}) {
  const [searchMode, setSearchMode] = useState("profile");

  useEffect(() => {
    onSearchModeChange?.(searchMode);
  }, [searchMode, onSearchModeChange]);

  return (
    <div className="direct-player-search">
      <PlayerSearchToggle key="player-toggle" onModeChange={setSearchMode} />

      {/* עטיפה אחידה לשני המצבים */}
      <div className="advanced-panel">
        {searchMode === "profile" ? (
          <PlayerProfileSearch 
            key="player-profile-search"
            onFiltersChange={onPlayerFiltersChange} 
            onSearch={onSearch} 
          />
        ) : (
          <PlayerStatsSearch 
            key="player-stats-search"
            onFiltersChange={onStatsFiltersChange} 
            onSearch={onSearch} 
          />
        )}
      </div>
    </div>
  );
}