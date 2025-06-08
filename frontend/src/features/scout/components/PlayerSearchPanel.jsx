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

  // עדכון ה־parent בכל שינוי במצב החיפוש
  useEffect(() => {
    if (onSearchModeChange) {
      onSearchModeChange(searchMode);
    }
  }, [searchMode, onSearchModeChange]);

  return (
    <div>
      <PlayerSearchToggle onModeChange={setSearchMode} />

      {searchMode === "profile" ? (
        <PlayerProfileSearch onFiltersChange={onPlayerFiltersChange} />
      ) : (
        <PlayerStatsSearch onFiltersChange={onStatsFiltersChange} />
      )}
    </div>
  );
}
