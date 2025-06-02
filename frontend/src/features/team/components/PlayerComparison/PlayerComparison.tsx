"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui"
import { Button } from "../../../../components/ui"
import { Badge } from "../../../../components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui"
import { BarChart2, RefreshCw, Send, Star } from "lucide-react"

// Mock data for players
const players = [
  {
    id: 1,
    name: "Bruno Fernandes",
    age: 22,
    position: "DM",
    nationality: "Portugal",
    club: "Sporting CP",
    marketValue: "€35M",
    attributes: {
      pace: 78,
      shooting: 82,
      passing: 90,
      dribbling: 85,
      defending: 75,
      physical: 80,
      vision: 88,
      positioning: 84,
      tackling: 76,
      technique: 87,
    },
    stats: {
      matches: 34,
      goals: 5,
      assists: 12,
      passAccuracy: 89,
      keyPasses: 2.4,
      interceptions: 1.8,
      tackles: 2.2,
      duelsWon: 58,
      fouls: 1.2,
    },
  },
  {
    id: 2,
    name: "Javier Rodríguez",
    age: 21,
    position: "DM",
    nationality: "Spain",
    club: "Sevilla",
    marketValue: "€28M",
    attributes: {
      pace: 75,
      shooting: 76,
      passing: 86,
      dribbling: 82,
      defending: 80,
      physical: 83,
      vision: 84,
      positioning: 85,
      tackling: 82,
      technique: 83,
    },
    stats: {
      matches: 30,
      goals: 3,
      assists: 8,
      passAccuracy: 87,
      keyPasses: 1.8,
      interceptions: 2.1,
      tackles: 2.5,
      duelsWon: 62,
      fouls: 1.5,
    },
  },
  {
    id: 3,
    name: "Thomas Müller",
    age: 23,
    position: "DM",
    nationality: "Germany",
    club: "Borussia Dortmund",
    marketValue: "€32M",
    attributes: {
      pace: 72,
      shooting: 78,
      passing: 83,
      dribbling: 80,
      defending: 85,
      physical: 86,
      vision: 82,
      positioning: 88,
      tackling: 84,
      technique: 80,
    },
    stats: {
      matches: 32,
      goals: 2,
      assists: 7,
      passAccuracy: 85,
      keyPasses: 1.5,
      interceptions: 2.4,
      tackles: 2.8,
      duelsWon: 65,
      fouls: 1.8,
    },
  },
  {
    id: 4,
    name: "Luca Pellegrini",
    age: 20,
    position: "DM",
    nationality: "Italy",
    club: "Atalanta",
    marketValue: "€18M",
    attributes: {
      pace: 80,
      shooting: 70,
      passing: 81,
      dribbling: 78,
      defending: 79,
      physical: 77,
      vision: 80,
      positioning: 82,
      tackling: 80,
      technique: 79,
    },
    stats: {
      matches: 28,
      goals: 1,
      assists: 5,
      passAccuracy: 84,
      keyPasses: 1.2,
      interceptions: 2.0,
      tackles: 2.3,
      duelsWon: 60,
      fouls: 1.4,
    },
  },
]

// Helper function to get color based on comparison
const getComparisonColor = (valueA: number, valueB: number) => {
  if (valueA > valueB) return "text-green-600"
  if (valueA < valueB) return "text-red-600"
  return ""
}

export default function PlayerComparison() {
  const [playerA, setPlayerA] = useState(players[0].id.toString())
  const [playerB, setPlayerB] = useState(players[1].id.toString())
  const [comparisonView, setComparisonView] = useState("attributes")

  const selectedPlayerA = players.find((p) => p.id.toString() === playerA)
  const selectedPlayerB = players.find((p) => p.id.toString() === playerB)

  const swapPlayers = () => {
    const temp = playerA
    setPlayerA(playerB)
    setPlayerB(temp)
  }

  if (!selectedPlayerA || !selectedPlayerB) return null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Player Comparison</CardTitle>
          <CardDescription>Compare two players side-by-side to analyze their strengths and weaknesses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div>
                <Select value={playerA} onValueChange={setPlayerA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select player A" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.name} ({player.club})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-center">
                <Button variant="outline" size="icon" onClick={swapPlayers}>
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Swap players</span>
                </Button>
              </div>
              <div>
                <Select value={playerB} onValueChange={setPlayerB}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select player B" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.name} ({player.club})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                    <AvatarFallback>
                      {selectedPlayerA.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{selectedPlayerA.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedPlayerA.age} • {selectedPlayerA.nationality} • {selectedPlayerA.club}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{selectedPlayerA.position}</Badge>
                      <Badge variant="outline">{selectedPlayerA.marketValue}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                    <AvatarFallback>
                      {selectedPlayerB.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{selectedPlayerB.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedPlayerB.age} • {selectedPlayerB.nationality} • {selectedPlayerB.club}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{selectedPlayerB.position}</Badge>
                      <Badge variant="outline">{selectedPlayerB.marketValue}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={comparisonView} onValueChange={setComparisonView} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="stats">Match Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="attributes" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Player Attributes Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(selectedPlayerA.attributes).map(([attribute, valueA]) => {
                      const valueB = selectedPlayerB.attributes[attribute as keyof typeof selectedPlayerB.attributes]
                      return (
                        <div key={attribute} className="grid grid-cols-5 items-center gap-2">
                          <div className="text-sm font-medium capitalize">
                            {attribute.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                          <div className={`text-right ${getComparisonColor(valueA, valueB)}`}>{valueA}</div>
                          <div className="col-span-1">
                            <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="absolute inset-0 flex">
                                <div className="bg-blue-600 h-full" style={{ width: `${valueA}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="absolute inset-0 flex">
                                <div className="bg-red-600 h-full" style={{ width: `${valueB}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className={`text-left ${getComparisonColor(valueB, valueA)}`}>{valueB}</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Match Statistics Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(selectedPlayerA.stats).map(([stat, valueA]) => {
                      const valueB = selectedPlayerB.stats[stat as keyof typeof selectedPlayerB.stats]
                      const max = Math.max(valueA, valueB) * 1.2
                      return (
                        <div key={stat} className="grid grid-cols-5 items-center gap-2">
                          <div className="text-sm font-medium capitalize">{stat.replace(/([A-Z])/g, " $1").trim()}</div>
                          <div className={`text-right ${getComparisonColor(valueA, valueB)}`}>{valueA}</div>
                          <div className="col-span-1">
                            <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="absolute inset-0 flex">
                                <div className="bg-blue-600 h-full" style={{ width: `${(valueA / max) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="absolute inset-0 flex">
                                <div className="bg-red-600 h-full" style={{ width: `${(valueB / max) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className={`text-left ${getComparisonColor(valueB, valueA)}`}>{valueB}</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Add Both to Watchlist
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Generate Comparison Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
