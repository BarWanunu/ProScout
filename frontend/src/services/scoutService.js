// services/scoutServices.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/scout";

export async function registerScout(scoutData, token) {
  const fd = new FormData();
  fd.append("first_name", scoutData.first_name);
  fd.append("last_name", scoutData.last_name);
  fd.append("phone", scoutData.phone);
  fd.append("nationality", scoutData.nationality);
  fd.append(
    "experience_years",
    scoutData.experience_years !== undefined &&
      scoutData.experience_years !== ""
      ? String(scoutData.experience_years)
      : ""
  );

  const imgFile = scoutData.image?.originFileObj || scoutData.image || null;
  if (imgFile) fd.append("image", imgFile);

  try {
    const res = await axios.post(API_BASE, fd, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("registerScout error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Scout registration failed." };
  }
}
