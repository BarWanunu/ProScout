"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui"
import { Button } from "../../../../components/ui"
import { Badge } from "../../../../components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui"
import { Textarea } from "../../../../components/ui"
import { Star, Trash2, Send, Eye, Bell, BellOff, Edit, Save, X } from "lucide-react"

// Mock data for watchlisted players
const watchlistedPlayers = [
  {
    id: 1,
    name: "Bruno Fernandes",
    age: 22,
    position: "DM",
    nationality: "Portugal",
    club: "Sporting CP",
    marketValue: "€35M",
    addedDate: "2024-05-10",
    lastUpdated: "2024-05-20",
    notes: "Excellent passing range and vision. Could be perfect for our system.",
    notifications: true,
    recentEvents: [
      {
        type: "performance",
        date: "2024-05-18",
        description: "2 assists in 3-1 win vs. Benfica",
      },
      {
        type: "injury",
        date: "2024-05-05",
        description: "Minor knock, returned after 1 game",
      },
    ],
  },
  {
    id: 2,
    name: "Javier Rodríguez",
    age: 21,
    position: "DM",
    nationality: "Spain",
    club: "Sevilla",
    marketValue: "€28M",
    addedDate: "2024-05-12",
    lastUpdated: "2024-05-19",
    notes: "Strong defensive midfielder with good ball-winning abilities.",
    notifications: true,
    recentEvents: [
      {
        type: "contract",
        date: "2024-05-15",
        description: "Contract negotiations reported to have stalled",
      },
    ],
  },
  {
    id: 3,
    name: "Thomas Müller",
    age: 23,
    position: "DM",
    nationality: "Germany",
    club: "Borussia Dortmund",
    marketValue: "€32M",
    addedDate: "2024-05-08",
    lastUpdated: "2024-05-21",
    notes: "Physical presence in midfield. Good aerial ability.",
    notifications: false,
    recentEvents: [
      {
        type: "performance",
        date: "2024-05-20",
        description: "Clean sheet and 90% pass completion vs. Bayern",
      },
    ],
  },
]

export default function Watchlist() {
  const [players, setPlayers] = useState(watchlistedPlayers)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedNotes, setEditedNotes] = useState("")

  const toggleNotifications = (playerId: number) => {
    setPlayers(
      players.map((player) => (player.id === playerId ? { ...player, notifications: !player.notifications } : player)),
    )
  }

  const removeFromWatchlist = (playerId: number) => {
    setPlayers(players.filter((player) => player.id !== playerId))
  }

  const startEditing = (playerId: number, notes: string) => {
    setEditingId(playerId)
    setEditedNotes(notes)
  }

  const saveNotes = (playerId: number) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId
          ? { ...player, notes: editedNotes, lastUpdated: new Date().toISOString().split("T")[0] }
          : player,
      ),
    )
    setEditingId(null)
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "performance":
        return "bg-green-100 text-green-800"
      case "injury":
        return "bg-red-100 text-red-800"
      case "contract":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Player Watchlist</CardTitle>
          <CardDescription>
            Track players of interest and keep notes on their performance and development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Players ({players.length})</TabsTrigger>
              <TabsTrigger value="notifications">
                With Notifications ({players.filter((p) => p.notifications).length})
              </TabsTrigger>
              <TabsTrigger value="recent">
                Recent Activity ({players.filter((p) => p.recentEvents.length > 0).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {players.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4" />
                  <p>Your watchlist is empty</p>
                  <p className="text-sm">Add players to track their progress and performance.</p>
                </div>
              ) : (
                players.map((player) => (
                  <Card key={player.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-start p-4 md:p-6 space-x-4 flex-1">
                        <Avatar className="h-16 w-16 border">
                          <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{player.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span>
                                  {player.age} • {player.nationality} • {player.club}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleNotifications(player.id)}
                                className="h-8 w-8"
                              >
                                {player.notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                                <span className="sr-only">
                                  {player.notifications ? "Disable" : "Enable"} notifications
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromWatchlist(player.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove from watchlist</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{player.position}</Badge>
                            <Badge variant="outline">{player.marketValue}</Badge>
                            <Badge variant="secondary">Added: {player.addedDate}</Badge>
                          </div>

                          {player.recentEvents.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">Recent Activity:</p>
                              <div className="flex flex-wrap gap-2">
                                {player.recentEvents.map((event, index) => (
                                  <Badge key={index} className={getEventBadgeColor(event.type)} variant="outline">
                                    {event.description}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Notes:</p>
                            {editingId === player.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editedNotes}
                                  onChange={(e) => setEditedNotes(e.target.value)}
                                  className="min-h-[80px]"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="outline" onClick={cancelEditing}>
                                    <X className="mr-2 h-3 w-3" />
                                    Cancel
                                  </Button>
                                  <Button size="sm" onClick={() => saveNotes(player.id)}>
                                    <Save className="mr-2 h-3 w-3" />
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative bg-muted/50 p-2 rounded-md">
                                <p className="text-sm">{player.notes}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6"
                                  onClick={() => startEditing(player.id, player.notes)}
                                >
                                  <Edit className="h-3 w-3" />
                                  <span className="sr-only">Edit notes</span>
                                </Button>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">Last updated: {player.lastUpdated}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col justify-between border-t md:border-t-0 md:border-l p-4 bg-muted/20">
                        <Button variant="outline" size="sm" className="flex-1 md:mb-2">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                        <Button size="sm" className="flex-1 ml-2 md:ml-0">
                          <Send className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              {players.filter((p) => p.notifications).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4" />
                  <p>No players with notifications</p>
                  <p className="text-sm">Enable notifications to get updates on player activity.</p>
                </div>
              ) : (
                players
                  .filter((p) => p.notifications)
                  .map((player) => (
                    <Card key={player.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{player.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleNotifications(player.id)}
                              className="h-8 w-8"
                            >
                              <BellOff className="h-4 w-4" />
                              <span className="sr-only">Disable notifications</span>
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {player.position} • {player.club}
                          </p>
                          {player.recentEvents.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-2">
                                {player.recentEvents.map((event, index) => (
                                  <Badge key={index} className={getEventBadgeColor(event.type)} variant="outline">
                                    {event.description}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {players.filter((p) => p.recentEvents.length > 0).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4" />
                  <p>No recent activity</p>
                  <p className="text-sm">Players with recent updates will appear here.</p>
                </div>
              ) : (
                players
                  .filter((p) => p.recentEvents.length > 0)
                  .map((player) => (
                    <Card key={player.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{player.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromWatchlist(player.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove from watchlist</span>
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {player.position} • {player.club}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Recent Activity:</p>
                            <div className="flex flex-wrap gap-2">
                              {player.recentEvents.map((event, index) => (
                                <Badge key={index} className={getEventBadgeColor(event.type)} variant="outline">
                                  {event.date}: {event.description}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Watchlist Notifications</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You'll receive notifications for player performances, injuries, contract updates, and transfer
                      rumors for players in your watchlist with notifications enabled.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
