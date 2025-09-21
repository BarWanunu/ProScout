import { http } from "../http";

const endpoint = "/recommendation";

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

export default {
  createRecommendation,
  deleteRecommendation,
  getRecommendationsByPlayer,
  getRecommendationsByScout,
  getRecommendationsByTeam,
};
