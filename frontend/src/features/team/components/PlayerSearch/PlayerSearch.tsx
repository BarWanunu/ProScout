"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui"
import { Button } from "../../../../components/ui"
import { Input } from "../../../../components/ui"
import { Badge } from "../../../../components/ui"
import { Slider } from "../../../../components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui"
import { Search, Filter, Star, ArrowUpDown, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui"

// Mock data for players
const players = [
  {
    id: 1,
    name: "Bruno Fernandes",
    age: 22,
    position: "DM",
    nationality: "Portugal",
    club: "Sporting CP",
    league: "Primeira Liga",
    contract: "2025",
    marketValue: 35000000,
    stats: {
      matches: 34,
      goals: 5,
      assists: 12,
      passAccuracy: 89,
    },
  },
  {
    id: 2,
    name: "Javier Rodríguez",
    age: 21,
    position: "DM",
    nationality: "Spain",
    club: "Sevilla",
    league: "La Liga",
    contract: "2024",
    marketValue: 28000000,
    stats: {
      matches: 30,
      goals: 3,
      assists: 8,
      passAccuracy: 87,
    },
  },
  {
    id: 3,
    name: "Thomas Müller",
    age: 23,
    position: "DM",
    nationality: "Germany",
    club: "Borussia Dortmund",
    league: "Bundesliga",
    contract: "2026",
    marketValue: 32000000,
    stats: {
      matches: 32,
      goals: 2,
      assists: 7,
      passAccuracy: 85,
    },
  },
  {
    id: 4,
    name: "Luca Pellegrini",
    age: 20,
    position: "DM",
    nationality: "Italy",
    club: "Atalanta",
    league: "Serie A",
    contract: "2025",
    marketValue: 18000000,
    stats: {
      matches: 28,
      goals: 1,
      assists: 5,
      passAccuracy: 84,
    },
  },
  {
    id: 5,
    name: "Jack Wilson",
    age: 24,
    position: "CM",
    nationality: "England",
    club: "Leicester City",
    league: "Premier League",
    contract: "2023",
    marketValue: 22000000,
    stats: {
      matches: 36,
      goals: 4,
      assists: 6,
      passAccuracy: 82,
    },
  },
  {
    id: 6,
    name: "Antoine Dupont",
    age: 22,
    position: "CM",
    nationality: "France",
    club: "Lyon",
    league: "Ligue 1",
    contract: "2024",
    marketValue: 25000000,
    stats: {
      matches: 33,
      goals: 6,
      assists: 9,
      passAccuracy: 86,
    },
  },
]

export default function PlayerSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ageRange, setAgeRange] = useState([16, 35])
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])
  const [valueRange, setValueRange] = useState([0, 50000000])
  const [contractStatus, setContractStatus] = useState("all")
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [watchlisted, setWatchlisted] = useState<number[]>([])

  const toggleWatchlist = (playerId: number) => {
    if (watchlisted.includes(playerId)) {
      setWatchlisted(watchlisted.filter((id) => id !== playerId))
    } else {
      setWatchlisted([...watchlisted, playerId])
    }
  }

  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const togglePosition = (position: string) => {
    if (selectedPositions.includes(position)) {
      setSelectedPositions(selectedPositions.filter((p) => p !== position))
    } else {
      setSelectedPositions([...selectedPositions, position])
    }
  }

  const toggleLeague = (league: string) => {
    if (selectedLeagues.includes(league)) {
      setSelectedLeagues(selectedLeagues.filter((l) => l !== league))
    } else {
      setSelectedLeagues([...selectedLeagues, league])
    }
  }

  // Filter players based on search criteria
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      searchQuery === "" ||
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAge = player.age >= ageRange[0] && player.age <= ageRange[1]

    const matchesPosition = selectedPositions.length === 0 || selectedPositions.includes(player.position)

    const matchesLeague = selectedLeagues.length === 0 || selectedLeagues.includes(player.league)

    const matchesValue = player.marketValue >= valueRange[0] && player.marketValue <= valueRange[1]

    let matchesContract = true
    if (contractStatus === "expiring") {
      matchesContract = Number.parseInt(player.contract) <= new Date().getFullYear() + 1
    } else if (contractStatus === "long-term") {
      matchesContract = Number.parseInt(player.contract) > new Date().getFullYear() + 1
    }

    return matchesSearch && matchesAge && matchesPosition && matchesLeague && matchesValue && matchesContract
  })

  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    let aValue, bValue

    switch (sortColumn) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "age":
        aValue = a.age
        bValue = b.age
        break
      case "value":
        aValue = a.marketValue
        bValue = b.marketValue
        break
      default:
        aValue = a.name
        bValue = b.name
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Get unique positions and leagues for filters
  const positions = Array.from(new Set(players.map((player) => player.position)))
  const leagues = Array.from(new Set(players.map((player) => player.league)))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Filter Player Search</CardTitle>
          <CardDescription>Find players that match specific criteria with advanced filtering options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, club, or nationality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">
                  Age Range: {ageRange[0]}-{ageRange[1]}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Slider value={ageRange} min={16} max={40} step={1} onValueChange={setAgeRange} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">
                  Market Value: €{(valueRange[0] / 1000000).toFixed(1)}M - €{(valueRange[1] / 1000000).toFixed(1)}M
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Slider value={valueRange} min={0} max={100000000} step={1000000} onValueChange={setValueRange} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Contract Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Select value={contractStatus} onValueChange={setContractStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contracts</SelectItem>
                    <SelectItem value="expiring">Expiring (≤ 1 year)</SelectItem>
                    <SelectItem value="long-term">Long Term ({">"}1 year)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Position</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {positions.map((position) => (
                    <Badge
                      key={position}
                      variant={selectedPositions.includes(position) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePosition(position)}
                    >
                      {position}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">League</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {leagues.map((league) => (
                    <Badge
                      key={league}
                      variant={selectedLeagues.includes(league) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleLeague(league)}
                    >
                      {league}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                    <div className="flex items-center">
                      Player
                      {sortColumn === "name" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          } transition-transform`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("age")}>
                    <div className="flex items-center">
                      Age
                      {sortColumn === "age" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          } transition-transform`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("value")}>
                    <div className="flex items-center">
                      Value
                      {sortColumn === "value" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          } transition-transform`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleWatchlist(player.id)}
                        className="h-8 w-8"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            watchlisted.includes(player.id) ? "fill-yellow-400 text-yellow-400" : ""
                          }`}
                        />
                        <span className="sr-only">Add to watchlist</span>
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.age}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{player.position}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{player.club}</span>
                        <span className="text-xs text-muted-foreground">{player.league}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          Number.parseInt(player.contract) <= new Date().getFullYear() + 1 ? "destructive" : "outline"
                        }
                      >
                        {player.contract}
                      </Badge>
                    </TableCell>
                    <TableCell>€{(player.marketValue / 1000000).toFixed(1)}M</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedPlayers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No players match your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
