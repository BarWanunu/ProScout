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
  console.log(response.data);
  return response.data.players;
}

const shortlistService = { addPlayer, removePlayer, getShortlist };
export default shortlistService;
