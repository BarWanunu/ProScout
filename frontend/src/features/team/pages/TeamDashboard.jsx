import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  FileText,
  BarChart2,
  Star,
  Filter,
} from "lucide-react";

import Watchlist            from "../components/Watchlist/Watchlist111";
import SmartRecommender     from "../components/SmartRecommender/SmartRecommender.jsx";
import PlayerSearch         from "../components/PlayerSearch/PlayerSearch.jsx";
import PlayerComparison     from "../components/PlayerComparison/PlayerComparison.jsx";

import "../styles/TeamDashboard.css";        //  ⬅ new style

export default function TeamDashboard() {
  const [activeTab, setActiveTab] = useState("recommender");
  const [fadeIn,   setFadeIn]   = useState(false);

  /* simple mount animation (same trick as InitialSignup) */
  useEffect(() => setFadeIn(true), []);

  const renderTab = () => {
    switch (activeTab) {
      case "search":     return <PlayerSearch />;
      case "compare":    return <PlayerComparison />;
      case "watchlist":  return <Watchlist />;
      default:           return <SmartRecommender />;
    }
  };

  return (
    <div className={`td-wrapper ${fadeIn ? "fade-in" : "fade-out"}`}>
      {/* ---------- HEADER ---------- */}
      <header className="td-header">
        <div className="td-heading">
          <h1>Team&nbsp;Dashboard</h1>
          <p>Discover, analyse &amp; contact players that fit your team’s needs</p>
        </div>

        <div className="td-actions">
          <button className="td-btn td-btn--outline">
            <FileText size={18} />
            <span>Reports</span>
          </button>
          <button className="td-btn">
            <Search size={18} />
            <span>New&nbsp;Search</span>
          </button>
        </div>
      </header>

      {/* ---------- TABS ---------- */}
      <nav className="td-tabs">
        <button
          className={`td-tab ${activeTab === "recommender" ? "active" : ""}`}
          onClick={() => setActiveTab("recommender")}
        >
          <Star size={18} /> <span>Smart&nbsp;Recommender</span>
        </button>


        <button
          className={`td-tab ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
        >
          <Filter size={18} /> <span>Player&nbsp;Search</span>
        </button>

        <button
          className={`td-tab ${activeTab === "compare" ? "active" : ""}`}
          onClick={() => setActiveTab("compare")}
        >
          <BarChart2 size={18} /> <span>Player&nbsp;Comparison</span>
        </button>

        <button
          className={`td-tab ${activeTab === "watchlist" ? "active" : ""}`}
          onClick={() => setActiveTab("watchlist")}
        >
          <Star size={18} /> <span>Watchlist</span>
        </button>
      </nav>

      {/* ---------- CONTENT ---------- */}
      <main className="td-content">{renderTab()}</main>
    </div>
  );
}
