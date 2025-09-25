"use client"

import { useAuth } from "@/auth/AuthContext"
import playerService from "@/api/services/playerService"
import { useState, useEffect } from "react"
import Header from "@/layout/overallLayout/Header.jsx";
import Footer from "@/layout/overallLayout/Footer.jsx";
import WelcomeSection from "@/components/common/WelcomeSection";
import PlayerDashboardTabs from "../components/PlayerDashboardTabs";
import "../styles/PlayerDashboard.css";

export default function PlayerDashboard() {
  const { id: userId, token } = useAuth()
  const [fadeIn, setFadeIn] = useState(false);
  const [summary, setSummary] = useState(null)
  const [player, setPlayer] = useState(null)

  useEffect(() => setFadeIn(true), []);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // קודם שולפים את השחקן כדי לדעת את ה-id שלו
        const playerData = await playerService.getPlayerById(userId, token)
        setPlayer(playerData)
        
        // Set document title with player name when available
        if (playerData?.name) {
          document.title = `${playerData.name} - ProScout`;
        }
        
        if (playerData?.id) {
          const data = await playerService.getPlayerStatsSummary(playerData.id, 2022, 2024)
          setSummary(data)
          console.log("✅ Player stats summary:", data)
        }
      } catch (err) {
        console.error("❌ Failed to fetch stats summary:", err)
      }
    }

    if (userId && token) {
      fetchPlayerData()
    }
    
    // Reset document title when component unmounts
    return () => {
      document.title = "ProScout";
    };
  }, [userId, token])

  return (
    <>
      <Header />
      <div className={`pd-wrapper ${fadeIn ? "fade-in" : "fade-out"}`}>
        {/* ---------- WELCOME SECTION ---------- */}
        <WelcomeSection user={player} userType="player" imageStyle="circle" />
        
        {/* ---------- DASHBOARD TABS ---------- */}
        <div className="player-dashboard-container">
          <PlayerDashboardTabs 
            player={player} 
            summary={summary}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
