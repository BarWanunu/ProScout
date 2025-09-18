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
  const formData = new formData();

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
  console.log("➡️ Calling /scout/:id with:", id); // ← לוג של ה־id
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await http.get(`${endpoint}/${id}`, config);
  console.log("⬅️ Raw response from backend:", response.data); // ← לוג תשובה גולמית
  return response.data.scout; // מחזירים רק את האובייקט של scout
}

const scoutService = {
  registerScout,
  updateScoutField,
  deleteScout,
  getScoutById,
};

export default scoutService;
