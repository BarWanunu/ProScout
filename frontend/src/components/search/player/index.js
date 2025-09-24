import { createContext, useContext } from "react";

// Context to share player data between components if needed
export const PlayerContext = createContext(null);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      "usePlayerContext must be used within a PlayerContext.Provider"
    );
  }
  return context;
};

// Index file to export all player components
export { default as PlayerInfo } from "./PlayerInfo";
export { default as PlayerStats } from "./PlayerStats";
export { default as PlayerProfile } from "./PlayerProfile";
