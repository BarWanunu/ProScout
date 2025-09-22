import { http } from "../http";

const endpoint = "/trial";

async function createTrial(data, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.post(endpoint, data, config);
  return response.data;
}

async function updateTrialStatus(id, status, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.patch(`${endpoint}/${id}`, { status }, config);
  return response.data;
}

async function deleteTrial(id, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.delete(`${endpoint}/${id}`, config);
  return response.data;
}

async function getTrialById(id, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await http.get(`${endpoint}/${id}`, config);
  return response.data;
}

async function getTrialsByPlayer(playerId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await http.get(`${endpoint}/player/${playerId}`, config);
  return response.data;
}

async function getTrialsByTeam(teamId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await http.get(`${endpoint}/team/${teamId}`, config);
  return response.data;
}

async function getTrialsByScout(scoutId, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await http.get(`${endpoint}/scout/${scoutId}`, config);
  return response.data;
}

export default {
  createTrial,
  updateTrialStatus,
  deleteTrial,
  getTrialById,
  getTrialsByPlayer,
  getTrialsByTeam,
  getTrialsByScout,
};
