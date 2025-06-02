/* ------------------------------------------------------------------
   Smart-Recommender list page (JSX version)
------------------------------------------------------------------ */
"use client";

import { useState, useMemo } from "react";

import RecommendationFilter from "./RecommendationFilter";
import PlayerList from "./PlayerList";

/* -------- mock data (unchanged) --------------------------------- */
const recommendedPlayers = [
  {
    id: 1,
    name: "Bruno Fernandes",
    age: 22,
    photo: "https://media.api-sports.io/football/players/5.png",
    position: "DM",
    nationality: "Portugal",
    club: "Sporting CP",
    matchScore: 92,
    lineBreaking: 87,
    defensiveActions: 82,
    passing: 90,
    contract: "2025",
    marketValue: "€35M",
    trending: "up",
    recentForm: 8.5,
    stats: { matches: 34, goals: 5, assists: 12, passAccuracy: 89 },
  },
  /* … 3 more objects … */
];

/* -------- component -------------------------------------------- */
export default function SmartRecommender({ searchQuery = "" }) {
  const [formation, setFormation] = useState("4-3-3");
  const [position, setPosition] = useState("GK");
  const [ageRange, setAgeRange] = useState([16, 25]);
  const [lineBreaking, setLineBreaking] = useState(80);
  const [sortBy, setSortBy] = useState("matchScore");
  const [watchlisted, setWatchlisted] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  /* -------- filter + sort -------------------------------------- */
  const filteredPlayers = useMemo(() => {
    const cleaned = searchQuery.trim().toLowerCase();

    return recommendedPlayers
      .filter((p) => {
        /* search text */
        const textMatch =
          cleaned === "" ||
          p.name.toLowerCase().includes(cleaned) ||
          p.club.toLowerCase().includes(cleaned) ||
          p.nationality.toLowerCase().includes(cleaned);

        /* sliders / dropdowns */
        const ageOK = p.age >= ageRange[0] && p.age <= ageRange[1];
        const posOK = p.position === position;
        const lineOK = p.lineBreaking >= lineBreaking;

        return textMatch && ageOK && posOK && lineOK;
      })
      .sort((a, b) => {
        if (sortBy === "matchScore") return b.matchScore - a.matchScore;
        if (sortBy === "age") return a.age - b.age;
        // market value: strip € and M, then compare
        const numA = parseFloat(a.marketValue.replace(/[€M]/g, ""));
        const numB = parseFloat(b.marketValue.replace(/[€M]/g, ""));
        return numA - numB;
      });
  }, [searchQuery, position, ageRange, lineBreaking, sortBy]);

  /* -------- actions -------------------------------------------- */
  const toggleWatchlist = (id) =>
    setWatchlisted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // fake API delay
  };

  // const trendIcon = (trend) => {
  //   if (trend === "up")
  //     return <TrendingUp className="h-3 w-3 text-green-500" />;
  //   if (trend === "down")
  //     return (
  //       <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
  //     );
  //   return <Target className="h-3 w-3 text-gray-500" />;
  // };

  /* -------- render --------------------------------------------- */
  return (
    <div className="space-y-6 ">
      {/* filter card */}
      <RecommendationFilter
        /* values */
        formation={formation}
        position={position}
        ageRange={ageRange}
        lineBreaking={lineBreaking}
        sortBy={sortBy}
        playersFound={filteredPlayers.length}
        isLoading={isLoading}
        /* setters / callbacks */
        setFormation={setFormation}
        setPosition={setPosition}
        setAgeRange={setAgeRange}
        setLineBreaking={setLineBreaking}
        setSortBy={setSortBy}
        onApply={handleApplyFilters}
      />

      {/* -------- player list (collapsed for brevity) ------------- */}
      {/*  👉  Re-enable your previous JSX for the list / skeleton / 
              empty-state here; no TypeScript changes are needed   */}

      <PlayerList
        players={filteredPlayers}
        watchlisted={watchlisted}
        toggleWatchlist={toggleWatchlist}
        loading={isLoading}
        selected={selectedPlayer}
        setSelected={setSelectedPlayer}
      />
    </div>
  );
}
