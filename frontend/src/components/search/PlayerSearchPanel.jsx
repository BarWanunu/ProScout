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
    <div>
      <PlayerSearchToggle key="player-toggle" onModeChange={setSearchMode} />

      {/* עטיפה אחידה לשני המצבים */}
      <div className="player-stats-box p-4">
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