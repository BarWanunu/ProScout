"use client"

import { useAuth } from "@/auth/AuthContext"
import playerService from "@/api/services/playerService"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../layout/ui"
import { Footer, Header } from "@/layout/overallLayout"
import MessagesDemo from "@/components/MessageDemo"
import RecommendationDemo from "@/components/ReccomendationDemo"
import { PlayerSearch } from "@/components/search"

export default function PlayerDashboard() {
  const { id: userId, token } = useAuth()
  const [summary, setSummary] = useState(null)
  const [activeTab, setActiveTab] = useState("stats")

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // קודם שולפים את השחקן כדי לדעת את ה-id שלו
        const player = await playerService.getPlayerById(userId, token)

        if (player?.id) {
          const data = await playerService.getPlayerStatsSummary(player.id, 2022, 2024)
          setSummary(data)
          console.log("✅ Player stats summary:", data)
        }
      } catch (err) {
        console.error("❌ Failed to fetch stats summary:", err)
      }
    }

    if (userId && token) {
      fetchSummary()
    }
  }, [userId, token])

  const renderContent = () => {
    switch(activeTab) {
      case "stats":
        return (
          <Card>
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
        return <PlayerSearch />;
      case "messages":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <MessagesDemo /> 
            </CardContent>
          </Card>
        );
      case "recommendations":
        return <RecommendationDemo />;
      default:
        return null;
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* Simple Tab Navigation */}
        <div className="flex space-x-2 mb-4 border-b pb-2">
          <button 
            className={`px-4 py-2 ${activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => setActiveTab('search')}
          >
            Search 🔍
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'messages' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => setActiveTab('messages')}
          >
            Messages 💬
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'recommendations' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
            onClick={() => setActiveTab('recommendations')}
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
