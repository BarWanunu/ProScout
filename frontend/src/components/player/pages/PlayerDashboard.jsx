"use client"

import { useAuth } from "@/auth/AuthContext"
import playerService from "@/api/services/playerService"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../layout/ui"
import { Footer, Header } from "@/layout/overallLayout"
import MessagesDemo from "@/components/MessageDemo"
import TrialDemo from "@/components/TrialDemo"


export default function PlayerDashboard() {
  const { id: userId, token } = useAuth()
  const [summary, setSummary] = useState(null)

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

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* --- כרטיס סטטיסטיקות --- */}
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

        {/* --- כרטיס הודעות --- */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <MessagesDemo /> 
          </CardContent>
        </Card>
        <TrialDemo />
      </div>
      <Footer />
    </>
  )
}
