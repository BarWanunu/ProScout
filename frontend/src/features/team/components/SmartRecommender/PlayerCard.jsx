/* ------------------------------------------------------------------
   Single player card  (pure JSX – no Tailwind colours)
------------------------------------------------------------------ */
"use client";
import "./PlayerCard.css"

import {
  Card,
  Button,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Progress,
  CardContent,
} from "../../../../components/ui";
import { Star, ArrowUpRight, Send } from "lucide-react";

export default function PlayerCard({
  player,
  isWatchlisted,
  onToggleWatchlist,
  onSelect,
  selected = false,
}) {
  return (
    <Card 
        className={`player-card ${selected ? "player-card--selected" : ""}`}
        onClick={onSelect}>
      <div className="pc-flex">
        {/* --- Left area ------------------------------------------------ */}
        <div className="pc-left">
          <Avatar className="pc-avatar">
            <AvatarImage src={player.photo} />
            <AvatarFallback>
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="pc-info">
            <div className="pc-row">
              <h3 className="pc-name">{player.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="pc-watch"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(player.id);
                }}
              >
                <Star
                  className={
                    isWatchlisted
                      ? "pc-star pc-star--active"
                      : "pc-star pc-star--inactive"
                  }
                />
              </Button>
            </div>

            <span className="pc-sub">
              {player.age} • {player.nationality} • {player.club}
            </span>

            <div className="pc-badges">
              <Badge variant="outline">{player.position}</Badge>
              <Badge variant="outline">Club : {player.club}</Badge>
              <Badge variant="outline">{player.height}</Badge>
            </div>

            {/* KPIs */}
            <div className="pc-kpis">
              {[
                ["Interceptions", player.interceptions],
                ["Passes Completed", player.passesCompleted],
                ["Rating", player.rating],
              ].map(([label, pct]) => (
                <div key={label} className="pc-kpi">
                  <span className="pc-kpi-label">{label}</span>
                  <Progress value={pct} className="pc-kpi-bar" />
                  <span className="pc-kpi-val">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Right-hand actions -------------------------------------- */}
        <div className="pc-actions">
          <Button variant="outline" size="sm" className="pc-act-btn">
            <ArrowUpRight size={16} />
            View Profile
          </Button>
          <Button size="sm" className="pc-act-btn pc-act-btn--primary">
            <Send size={16} />
            Contact
          </Button>
        </div>
      </div>

      {/* extra spacing so CardContent stays happy */}
      <CardContent />
    </Card>
  );
}
