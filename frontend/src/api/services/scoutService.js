import { http } from "../http";

const endpoint = "/scout";

async function registerScout(data, token) {
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

async function updateScoutField({ field, value, token }) {
  const formData = new FormData();

  if (field === "image" && value instanceof File) {
    formData.append("image", value);
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

async function deleteScout(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await http.delete(endpoint, config);
  return response.data;
}

async function getScoutById(id, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.get(`${endpoint}/${id}`, config);
  console.log("⬅️ Raw response from backend:", response.data);
  return response.data.scout;
}

async function getScoutByScoutId(id) {
  const response = await http.get(`${endpoint}/scout-id/${id}`);
  return response.data.scout;
}

const scoutService = {
  registerScout,
  updateScoutField,
  deleteScout,
  getScoutById,
  getScoutByScoutId,
};

export default scoutService;
