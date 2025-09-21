import { http } from "../http";

const endpoint = "/search";

// ----- Players -----

async function searchPlayersByName(name) {
  const response = await http.get(`${endpoint}/players`, { params: { name } });
  return response.data;
}

async function advancedSearchPlayers(filters) {
  const response = await http.post(`${endpoint}/players/advanced`, filters);
  return response.data;
}

async function searchPlayersWithStats(filters) {
  const response = await http.post(`${endpoint}/players/stats`, filters);
  return response.data;
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

export default {
  searchPlayersByName,
  advancedSearchPlayers,
  searchPlayersWithStats,
  searchTeamsByName,
  advancedSearchTeams,
  searchScoutsByName,
};
