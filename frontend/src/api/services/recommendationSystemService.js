import { http } from "../http";
import { getToken } from "../tokenStore";

const endpoint = "/recommendations-system";

const getConfig = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

async function createRecommendation(data, token) {
  const config = { headers: { Authirization: `Breaer ${token}` } };
  const response = await http.post(endpoint, data, config);
  return response.data;
}

async function deleteRecommendation(id, token) {
  const config = { headers: { Authirization: `Breaer ${token}` } };
  const response = await http.delete(`${endpoint}/${id}`, config);
  return response.data;
}

async function getRecommendationsByPlayer(playerId, token) {
  const config = { headers: { Authirization: `Breaer ${token}` } };
  const response = await http.get(`${endpoint}/player/${playerId}`, config);
  return response.data;
}
async function getRecommendationsByTeam(token) {
  const config = { headers: { Authirization: `Breaer ${token}` } };
  const response = await http.get(`${endpoint}/team`, config);
  return response.data;
}
async function getRecommendationsByScout(token) {
  const config = { headers: { Authirization: `Breaer ${token}` } };
  const response = await http.get(`${endpoint}/scout`, config);
  return response.data;
}

/**
 * Gets player recommendations based on a selected player's name.
 * @param {string} playerName The name of the player to get recommendations for.
 * @returns {Promise<Object>} An object containing the selected player and a list of recommendations.
 */
export const getPlayerRecommendations = async (playerName) => {
  try {
    const response = await http.post('/recommendations', { playerName });
    return response.data;
  } catch (error) {
    console.error('Error fetching player recommendations:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch recommendations');
  }
};

async function getAllPlayers() {
  const response = await http.get(`${endpoint}/players`, getConfig());
  return response.data;
}

async function getSimilarPlayers(playerRk) {
  const response = await http.get(`${endpoint}/similar/${playerRk}`, getConfig());
  return response.data;
}

async function generateScoutReport(payload) {
  const response = await http.post(`${endpoint}/generate-report`, payload, getConfig());
  return response.data;
}

async function getPlayerImage(params) {
  const searchParams = new URLSearchParams();
  if (params?.name) searchParams.set('name', params.name);
  if (params?.squad) searchParams.set('squad', params.squad);
  const response = await http.get(`${endpoint}/player-image?${searchParams.toString()}`, getConfig());
  return response.data;
}

export default {
  createRecommendation,
  deleteRecommendation,
  getRecommendationsByPlayer,
  getRecommendationsByScout,
  getRecommendationsByTeam,
  getAllPlayers,
  getSimilarPlayers,
  generateScoutReport,
  getPlayerImage,
};
