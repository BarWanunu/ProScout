import { useState } from "react";
import PlayerSearchToggle from "./PlayerSearchToggle";
import PlayerProfileSearch from "./PlayerProfileSearch";

export default function PlayerSearchPanel({ onPlayerFiltersChange }) {
  const [searchMode, setSearchMode] = useState("profile");

  return (
    <div>
      <PlayerSearchToggle onModeChange={setSearchMode} />

      {searchMode === "profile" ? (
        <PlayerProfileSearch onFiltersChange={onPlayerFiltersChange} />
      ) : (
        <div>📊 Stats search fields will go here</div>
      )}
    </div>
  );
}
