/* ------------------------------------------------------------------
   Renders list, skeleton & empty-state
------------------------------------------------------------------ */
"use client";

import { Card, Button } from "../../../../components/ui";
import { Search } from "lucide-react";
import PlayerCard from "./PlayerCard";
import "./PlayerList.css";
export default function PlayerList({
  players,
  watchlisted,
  toggleWatchlist,
  loading,
  selected,
  setSelected,
}) {
  /* 1. loading skeleton (simple) */
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse p-8 h-[148px] player-skeleton" />
        ))}
      </div>
    );
  }

  /* 2. empty → prompt reset */
  if (players.length === 0) {
    return (
      <Card className="p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium empty-text">No players found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters to see more results
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reset Filters
        </Button>
      </Card>
    );
  }

  /* 3. real list */
  return (
    <div className="space-y-4">
      {players.map((pl) => (
        <PlayerCard
            key={pl.id}
            player={pl}
            isWatchlisted={watchlisted.includes(pl.id)}
            onToggleWatchlist={toggleWatchlist}
            onSelect={() => setSelected((cur) => (cur === pl.id ? null : pl.id))}
            selected={selected === pl.id}
            
        />
      ))}
    </div>
  );
}
