import React, { useEffect, useState } from "react";
import {
  Search,
  FileText,
  BarChart2,
  Star,
  Filter,
  XCircle
} from "lucide-react";

import Watchlist from "../components/Watchlist/Watchlist111.js";
import SmartRecommender from "../components/SmartRecommender/SmartRecommender.jsx";
import PlayerSearch from "../components/PlayerSearch/PlayerSearch.js";
import PlayerComparison from "../components/PlayerComparison/PlayerComparison.js";
import Header from "@/layout/overallLayout/Header.jsx";
import Footer from "@/layout/overallLayout/Footer.jsx";
import teamService from "@/api/services/teamService";
import shortlistService from "@/api/services/shortlistService";
import trialService from "@/api/services/trialService"; // ✅ לוודא שקיים
import { getToken } from "@/api/tokenStore";

import "../styles/TeamDashboard.css";
import MessagesDemo from "@/components/MessageDemo.jsx";
import TrialDemo from "@/components/TrialDemo.jsx";

export default function TeamDashboard() {
  const [activeTab, setActiveTab] = useState("recommender");
  const [fadeIn, setFadeIn] = useState(false);
  const [team, setTeam] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [trials, setTrials] = useState([]); // ✅ סטייט למבחנים

  useEffect(() => setFadeIn(true), []);

  // --- Fetch Team ---
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = getToken();
        const userId = localStorage.getItem("id");
        if (!userId) return;

        const teamData = await teamService.getTeamById(userId, token);
        setTeam(teamData.team);
      } catch (err) {
        console.error("❌ Error fetching team:", err);
      }
    };

    fetchTeam();
  }, []);

  // --- Fetch Trials (רק אחרי שהקבוצה נטענת) ---
  useEffect(() => {
    const fetchTrials = async () => {
      try {
        const token = getToken();
        if (!team) return;

        const trialsData = await trialService.getTrialsByTeam(team.id, token);
        setTrials(trialsData);
      } catch (err) {
        console.error("❌ Error fetching trials:", err);
      }
    };

    fetchTrials();
  }, [team]);

  // --- Fetch Shortlist ---
  useEffect(() => {
    const fetchShortlist = async () => {
      try {
        const token = getToken();
        const players = await shortlistService.getShortlist(token);
        setShortlist(players);
      } catch (err) {
        console.error("❌ Error fetching shortlist:", err);
      }
    };

    fetchShortlist();
  }, []);

  // --- Remove from Shortlist ---
  const handleRemove = async (playerId) => {
    try {
      const token = getToken();
      await shortlistService.removePlayer(playerId, token);
      setShortlist(shortlist.filter((p) => p.player_id !== playerId));
    } catch (err) {
      console.error("❌ Failed to remove player:", err);
    }
  };

  const addDummyPlayer = async () => {
    try {
      const token = getToken();
      const playerId = 5;

      const response = await shortlistService.addPlayer(playerId, token);
      console.log("✅ Added to shortlist:", response);

      const updatedList = await shortlistService.getShortlist(token);
      setShortlist(updatedList);
    } catch (err) {
      console.error("❌ Failed to add player:", err);
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
      case "messages":
        return <MessagesDemo />;
      case "trials":
        return <TrialDemo />; // ✅ שולחים ל־TrialDemo
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

            <button
              onClick={addDummyPlayer}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ➕ Add Dummy Player (ID 5)
            </button>
          </section>
        )}

        {/* ---------- SHORTLIST ---------- */}
        <section style={{ margin: "20px 0" }}>
          <h2>Shortlist</h2>
          {shortlist.length > 0 ? (
            <ul>
              {shortlist.map((player) => (
                <li
                  key={player.player_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    {player.name} – {player.position} ({player.club})
                  </span>
                  <button
                    onClick={() => handleRemove(player.player_id)}
                    style={{
                      color: "red",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <XCircle size={16} /> Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No players in shortlist.</p>
          )}
        </section>

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

          <button
            className={`td-tab ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            💬 <span>Messages</span>
          </button>

          <button
            className={`td-tab ${activeTab === "trials" ? "active" : ""}`}
            onClick={() => setActiveTab("trials")}
          >
            📋 <span>Trials</span>
          </button>
        </nav>

        {/* ---------- CONTENT ---------- */}
        <main className="td-content">{renderTab()}</main>
      </div>
      <Footer />
    </>
  );
}
