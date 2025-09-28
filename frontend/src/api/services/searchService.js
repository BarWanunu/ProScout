import { http } from "../http";
import playerService from "./playerService";

const endpoint = "/search";

const enrichPlayerData = async (players, searchType, matchedCriteria) => {
  const enrichedPlayers = await Promise.all(
    players.map(async (player) => {
      try {
        const fullPlayerData = await playerService.getPlayerFull(player.id);

        if (searchType === "statistics") {
          return {
            player: fullPlayerData.player,
            stats: null,
            searchType: searchType,
            matchedCriteria: matchedCriteria,
            matchedStats: player.matchedStats || null,
          };
        }

        // For profile search, use full data
        return {
          player: fullPlayerData.player,
          stats: fullPlayerData.stats,
          searchType: searchType,
          matchedCriteria: matchedCriteria,
          matchedStats: player.matchedStats || null,
        };
      } catch (err) {
        console.error(`Failed to get full data for player ${player.id}:`, err);
        return {
          player: player,
          stats: null,
          searchType: searchType,
          matchedCriteria: matchedCriteria,
          matchedStats: player.matchedStats || null,
        };
      }
    })
  );

  return enrichedPlayers;
};

// ----- Players -----

async function searchPlayersByName(name) {
  const response = await http.get(`${endpoint}/players`, { params: { name } });
  const result = response.data;

  if (result.success && result.data.length > 0) {
    const enrichedData = await enrichPlayerData(
      result.data,
      result.searchType,
      result.matchedCriteria
    );
    return {
      ...result,
      data: enrichedData,
    };
  }

  return result;
}

async function advancedSearchPlayers(filters) {
  const response = await http.post(`${endpoint}/players/advanced`, filters);
  const result = response.data;

  if (result.success && result.data.length > 0) {
    const enrichedData = await enrichPlayerData(
      result.data,
      result.searchType,
      result.matchedCriteria
    );
    return {
      ...result,
      data: enrichedData,
    };
  }

  return result;
}

async function searchPlayersWithStats(filters) {
  const response = await http.post(`${endpoint}/players/stats`, filters);
  const result = response.data;

  if (result.success && result.data.length > 0) {
    const enrichedData = await enrichPlayerData(
      result.data,
      result.searchType,
      result.matchedCriteria
    );
    return {
      ...result,
      data: enrichedData,
    };
  }

  return result;
}

// ----- Teams -----

async function searchTeamsByName(name) {
  const response = await http.get(`${endpoint}/teams`, {
    params: { name },
  });
  return response.data;
}

async function advancedSearchTeams(filters) {
  const response = await http.post(`${endpoint}/teams/advanced`, filters);
  return response.data;
}

// ----- Scouts -----

async function searchScoutsByName(name) {
  const response = await http.get(`${endpoint}/scouts`, {
    params: { name },
  });
  return response.data;
}

async function advancedSearchScouts(filters) {
  const response = await http.post(`${endpoint}/scouts/advanced`, filters);
  return response.data;
}

export default {
  searchPlayersByName,
  advancedSearchPlayers,
  searchPlayersWithStats,
  searchTeamsByName,
  advancedSearchTeams,
  searchScoutsByName,
  advancedSearchScouts,
};
