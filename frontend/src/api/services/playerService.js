import { http } from "../http";

const endpoint = "/player";

async function registerPlayer(data, token) {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  }

  const config = {
    headers: {
      "Content-type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.post(endpoint, formData, config);
  return response.data;
}

async function updatePlayer(data, token) {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  }

  const config = {
    headers: {
      "Content-type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.patch(endpoint, formData, config);
  return response.data;
}

async function deletePlayer(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.delete(endpoint, config);
  return response.data;
}

async function getPlayerById(playerId, token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.get(`${endpoint}/${playerId}`, config);
  return response.data.player;
}

async function getPlayerFull(playerId) {
  const response = await http.get(`${endpoint}/${playerId}/full`);
  return response.data;
}

async function getPlayerName(playerId) {
  const response = await http.get(`${endpoint}/${playerId}/name`);
  return response.data;
}

async function getPlayerStats(playerId) {
  const response = await http.get(`${endpoint}/stats/${playerId}`);
  return response.data;
}

async function getPlayerStatsSummary(playerId, fromYear, toYear) {
  const body = { fromYear, toYear };
  const response = await http.post(
    `${endpoint}/stats/${playerId}/summary`,
    body
  );
  return response.data.summary;
}

const playerService = {
  registerPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerById,
  getPlayerFull,
  getPlayerName,
  getPlayerStats,
  getPlayerStatsSummary,
};

export default playerService;
