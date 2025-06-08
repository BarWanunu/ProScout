"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui"
import { Button } from "../../../components/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui"
import { Progress } from "../../../components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui"
import { Star, TrendingUp, Users, Award } from "lucide-react"

export default function PlayerProfile() {
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  const playerData = {
    name: "Marco Silva",
    position: "Central Midfielder",
    age: 24,
    nationality: "Portugal",
    currentClub: "FC Porto",
    marketValue: 15000000,
    contract: "2026",
    height: "1.78m",
    foot: "Right",
    attributes: {
      technical: 88,
      physical: 76,
      mental: 92,
      pace: 72,
      shooting: 78,
      passing: 94,
      dribbling: 85,
      defending: 68,
      heading: 74,
    },
    stats: {
      appearances: 28,
      goals: 8,
      assists: 12,
      passAccuracy: 89,
      keyPasses: 2.4,
      tacklesWon: 1.8,
      interceptions: 2.1,
    },
    aiInsights: [
      "Exceptional ball distribution with 94% passing accuracy in the final third",
      "Shows strong leadership qualities and tactical awareness",
      "Injury-free for the past 18 months, indicating good physical condition",
      "Performance metrics suggest potential for top-tier European football",
    ],
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Player Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-lg">MS</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{playerData.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {playerData.position} • {playerData.age} years • {playerData.nationality}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-semibold">Current Club</div>
                  <div className="text-muted-foreground">{playerData.currentClub}</div>
                </div>
                <div>
                  <div className="font-semibold">Market Value</div>
                  <div className="text-muted-foreground">€{playerData.marketValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-semibold">Contract Until</div>
                  <div className="text-muted-foreground">{playerData.contract}</div>
                </div>
                <div>
                  <div className="font-semibold">Height / Foot</div>
                  <div className="text-muted-foreground">
                    {playerData.height} / {playerData.foot}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant={isWatchlisted ? "default" : "outline"} onClick={() => setIsWatchlisted(!isWatchlisted)}>
                <Star className={`mr-2 h-4 w-4 ${isWatchlisted ? "fill-current" : ""}`} />
                {isWatchlisted ? "Watchlisted" : "Add to Watchlist"}
              </Button>
              <Button className="w-full">Create Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Key Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Passing</span>
                    <span className="text-sm font-bold">{playerData.attributes.passing}</span>
                  </div>
                  <Progress value={playerData.attributes.passing} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mental</span>
                    <span className="text-sm font-bold">{playerData.attributes.mental}</span>
                  </div>
                  <Progress value={playerData.attributes.mental} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Technical</span>
                    <span className="text-sm font-bold">{playerData.attributes.technical}</span>
                  </div>
                  <Progress value={playerData.attributes.technical} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Season Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{playerData.stats.goals}</div>
                    <div className="text-sm text-muted-foreground">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{playerData.stats.assists}</div>
                    <div className="text-sm text-muted-foreground">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{playerData.stats.appearances}</div>
                    <div className="text-sm text-muted-foreground">Appearances</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{playerData.stats.passAccuracy}%</div>
                    <div className="text-sm text-muted-foreground">Pass Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Player Attributes</CardTitle>
              <CardDescription>Comprehensive breakdown of player abilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(playerData.attributes).map(([attribute, value]) => (
                  <div key={attribute} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {attribute.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-sm font-bold">{value}</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Season Statistics</CardTitle>
              <CardDescription>Detailed performance metrics for current season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(playerData.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {stat.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Powered Analysis
              </CardTitle>
              <CardDescription>Machine learning insights and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playerData.aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Scouting Reports
              </CardTitle>
              <CardDescription>Reports from scouts and analysts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>No reports available</p>
                <p className="text-sm">Scouting reports will appear here once submitted.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
