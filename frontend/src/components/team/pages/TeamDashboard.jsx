import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  FileText,
  BarChart2,
  Star,
  Filter,
} from "lucide-react";

import Watchlist from "../components/Watchlist/Watchlist111.js";
import SmartRecommender from "../components/SmartRecommender/SmartRecommender.jsx";
import PlayerSearch from "../components/PlayerSearch/PlayerSearch.js";
import PlayerComparison from "../components/PlayerComparison/PlayerComparison.js";
import Header from "@/layout/overallLayout/Header.jsx";
import Footer from "@/layout/overallLayout/Footer.jsx";
import teamService from "@/api/services/teamService";
import { getToken } from "@/api/tokenStore";

import "../styles/TeamDashboard.css";

export default function TeamDashboard() {
  const [activeTab, setActiveTab] = useState("recommender");
  const [fadeIn, setFadeIn] = useState(false);
  const [team, setTeam] = useState(null);

  /* simple mount animation */
  useEffect(() => setFadeIn(true), []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = getToken();
        const userId = localStorage.getItem("id"); // או "userId"
        if (!userId) return;

        const teamData = await teamService.getTeamById(userId, token);
        console.log("✅ Team response:", teamData);
        setTeam(teamData.team);
      } catch (err) {
        console.error("❌ Error fetching team:", err);
      }
    };

    fetchTeam();
  }, []);

  // 🔹 פונקציה לעדכון סטדיון לדוגמה
  const updateStadium = async () => {
    try {
      const token = getToken();
      const response = await teamService.updateTeamField({
        field: "formation",
        value: "4-2-3-1",
        token,
      });
      console.log("✅ Update response:", response);
      setTeam(response.team); // נעדכן גם בסטייט
    } catch (err) {
      console.error("❌ Failed to update stadium:", err);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "search":
        return <PlayerSearch />;
      case "compare":
        return <PlayerComparison />;
      case "watchlist":
        return <Watchlist />;
      default:
        return <SmartRecommender />;
    }
  };

  return (
    <>
      <Header />
      <div className={`td-wrapper ${fadeIn ? "fade-in" : "fade-out"}`}>
        {/* ---------- HEADER ---------- */}
        <header className="td-header">
          <div className="td-heading">
            <h1>
              {team ? `${team.team_name}'s Dashboard` : "Team Dashboard"}
            </h1>
            <p>
              Discover, analyse &amp; contact players that fit your team’s needs
            </p>
          </div>

          <div className="td-actions">
            <button className="td-btn td-btn--outline" onClick={updateStadium}>
              <FileText size={18} />
              <span>Update Stadium ➝ Camp Nou</span>
            </button>
            <button className="td-btn">
              <Search size={18} />
              <span>New&nbsp;Search</span>
            </button>
          </div>
        </header>

        {/* ---------- TEAM INFO ---------- */}
        {team && (
          <section style={{ margin: "20px 0" }}>
            <h2>Team Info</h2>
            <ul>
              <li><b>Name:</b> {team.team_name}</li>
              <li><b>League:</b> {team.league}</li>
              <li><b>Country:</b> {team.country}</li>
              <li><b>Formation:</b> {team.formation}</li>
              <li><b>Stadium:</b> {team.stadium}</li>
              <li><b>Trophies:</b> {team.trophies}</li>
            </ul>
          </section>
        )}

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
      <Footer />
    </>
  );
}
