import { useState, useEffect } from "react";
import PlayerSearchToggle from "./PlayerSearchToggle";
import PlayerProfileSearch from "./PlayerProfileSearch";
import PlayerStatsSearch from "./PlayerStatsSearch";

export default function PlayerSearchPanel({
  onPlayerFiltersChange,
  onStatsFiltersChange,
  onSearchModeChange,
}) {
  const [searchMode, setSearchMode] = useState("profile");

  useEffect(() => {
    onSearchModeChange?.(searchMode);
  }, [searchMode, onSearchModeChange]);

  return (
    <div>
      <PlayerSearchToggle onModeChange={setSearchMode} />

      {/* עטיפה אחידה לשני המצבים */}
      <div className="player-stats-box p-4">
        {searchMode === "profile" ? (
          <PlayerProfileSearch onFiltersChange={onPlayerFiltersChange} />
        ) : (
          <PlayerStatsSearch onFiltersChange={onStatsFiltersChange} />
        )}
      </div>
    </div>
  );
}

