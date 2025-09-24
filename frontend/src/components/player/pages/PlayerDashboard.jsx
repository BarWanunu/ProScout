"use client"

import { useAuth } from "@/auth/AuthContext"
import playerService from "@/api/services/playerService"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../layout/ui"
import { Footer, Header } from "@/layout/overallLayout"
import MessagesDemo from "@/components/MessageDemo"
import RecommendationDemo from "@/components/ReccomendationDemo"
import { PlayerSearch } from "@/components/search"
import WelcomeSection from "@/components/common/WelcomeSection"

export default function PlayerDashboard() {
  const { id: userId, token } = useAuth()
  const [summary, setSummary] = useState(null)
  const [player, setPlayer] = useState(null)
  const [activeTab, setActiveTab] = useState("stats")

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // קודם שולפים את השחקן כדי לדעת את ה-id שלו
        const playerData = await playerService.getPlayerById(userId, token)
        setPlayer(playerData)
        
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
  }, [userId, token])

  // Add state to track if we need to refresh content
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Handle tab switch with automatic refresh
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    // Increment refresh key to force child component refresh
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const renderContent = () => {
    switch(activeTab) {
      case "stats":
        return (
          <Card key={`stats-${refreshKey}`}>
            <CardHeader>
              <CardTitle>Stats Summary (2022 - 2024)</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <pre>{JSON.stringify(summary, null, 2)}</pre>
              ) : (
                <p>Loading stats summary...</p>
              )}
            </CardContent>
          </Card>
        );
      case "search":
        return <PlayerSearch key={`search-${refreshKey}`} />;
      case "messages":
        return (
          <Card key={`messages-${refreshKey}`}>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <MessagesDemo key={refreshKey} /> 
            </CardContent>
          </Card>
        );
      case "recommendations":
        return <RecommendationDemo key={`recommendations-${refreshKey}`} />;
      default:
        return null;
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <WelcomeSection user={player} userType="player" imageStyle="circle" />
        
        {/* Simple Tab Navigation */}
        <div className="flex space-x-2 mb-4 border-b pb-2">
          <button 
            className={`px-4 py-2 ${activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => handleTabSwitch('stats')}
          >
            Stats
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => handleTabSwitch('search')}
          >
            Search 🔍
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'messages' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => handleTabSwitch('messages')}
          >
            Messages 💬
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'recommendations' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => handleTabSwitch('recommendations')}
          >
            Recommendations ⭐
          </button>
        </div>

        {/* Content based on active tab */}
        {renderContent()}
      </div>
      <Footer />
    </>
  )
}
