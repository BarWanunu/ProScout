import { http } from "../http";

const endpoint = "/shortlist";

async function addPlayer(playerId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.post(endpoint, { player_id: playerId }, config);
  return response.data;
}

async function removePlayer(playerId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.delete(`${endpoint}/${playerId}`, config);
  return response.data;
}

async function getShortlist(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.get(endpoint, config);
  return response.data.players;
}

// Get teams that have shortlisted the current player
async function getTeamsByPlayer(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.get(`${endpoint}/my-teams`, config);
  return response.data.teams;
}

const shortlistService = {
  addPlayer,
  removePlayer,
  getShortlist,
  getTeamsByPlayer,
};
export default shortlistService;
