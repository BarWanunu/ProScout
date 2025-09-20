import { http } from "../http";

const endpoint = "/team";

async function registerTeam(data, token) {
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

async function updateTeamField({ field, value, token }) {
  const formData = new FormData();

  if (field === "logo" && value instanceof File) {
    formData.append("logo", value);
  } else {
    formData.append("field", field);
    formData.append("value", value);
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

async function deleteTeam(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.delete(endpoint, config);
  return response.data;
}

async function getTeamById(id) {
  const response = await http.get(`${endpoint}/${id}`);
  return response.data;
}

const teamService = {
  registerTeam,
  updateTeamField,
  deleteTeam,
  getTeamById,
};

export default teamService;
