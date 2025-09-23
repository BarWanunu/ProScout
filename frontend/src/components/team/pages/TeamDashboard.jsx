import React, { useEffect, useState } from "react";
import {
  Search,
  BarChart2,
  Star,
  CalendarDays,
  MessageCircle,
  Users
} from "lucide-react";

import { TeamSearch } from "@/components/search";
import Header from "@/layout/overallLayout/Header.jsx";
import Footer from "@/layout/overallLayout/Footer.jsx";
import WelcomeSection from "@/components/common/WelcomeSection";
import TeamStats from "../components/TeamStats.jsx";
import TrialsTab from "../components/TrialsTab.jsx";
import teamService from "@/api/services/teamService";
import shortlistService from "@/api/services/shortlistService";
import trialService from "@/api/services/trialService"; // ✅ לוודא שקיים
import { getToken } from "@/api/tokenStore";
import RecommendationDemo from "@/components/ReccomendationDemo.jsx";
import "../styles/TeamDashboard.css";
import MessagesDemo from "@/components/MessageDemo.jsx";

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
        console.log(teamData);
        
        
        // Set document title with team name when available
        if (teamData.team?.team_name) {
          document.title = `${teamData.team.team_name} - ProScout`;
        }
      } catch (err) {
        console.error("❌ Error fetching team:", err);
      }
    };

    fetchTeam();
    
    // Reset document title when component unmounts
    return () => {
      document.title = "ProScout";
    };
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

  const renderTab = () => {
    switch (activeTab) {
      case "search":
        return <TeamSearch />;
      case "messages":
        return <MessagesDemo />;
      case "trials":
        return <TrialsTab trials={trials} />;  
     
      default:
        return <TeamSearch />;
    }
  };

  return (
    <>
      <Header />
      <div className={`td-wrapper ${fadeIn ? "fade-in" : "fade-out"}`}>
        {/* ---------- WELCOME SECTION ---------- */}
        <WelcomeSection user={team} userType="team" imageStyle="square" />
        {/* ---------- TEAM STATS ---------- */}
        <TeamStats team={team} />
        
        {/* ---------- TABS ---------- */}

        {/* ---------- TABS ---------- */}
        <nav className="td-tabs">
          <button
            className={`td-tab ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            <Search size={18} /> <span>Player&nbsp;Search</span>
          </button>

          <button
            className={`td-tab ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            <MessageCircle size={18} /> <span>Messages</span>
          </button>

          <button
            className={`td-tab ${activeTab === "trials" ? "active" : ""}`}
            onClick={() => setActiveTab("trials")}
          >
            <CalendarDays size={18} /> <span>Trials</span>
          </button>
          
          <button
            className={`td-tab ${activeTab === "recommendations" ? "active" : ""}`}
            onClick={() => setActiveTab("recommendations")}
          >
            <Star size={18} /> <span>Recommendations</span>
          </button>
        </nav>

        {/* ---------- CONTENT ---------- */}
        <main className="td-content">{renderTab()}</main>
      </div>
      <Footer />
    </>
  );
}
