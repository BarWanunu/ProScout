// services/playerServices.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/player";

export const registerPlayer = async (profileData, token) => {
  const fd = new FormData();

  fd.append("name", profileData.name);
  fd.append("first_name", profileData.first_name);
  fd.append("last_name", profileData.last_name);
  fd.append("age", String(profileData.age));
  fd.append("club", profileData.club || "Free Agent ");
  fd.append("number", String(profileData.number));
  fd.append("position", profileData.position);
  fd.append("height", profileData.height);
  fd.append("weight", profileData.weight);
  fd.append("nationality", profileData.nationality);
  fd.append("birthdate", profileData.birthdate);

  const photoFile =
    profileData.photo?.originFileObj || profileData.photo || null;
  const videoFile =
    profileData.video?.originFileObj || profileData.video || null;
  if (photoFile) fd.append("photo", photoFile);
  if (videoFile) fd.append("video", videoFile);

  try {
    const res = await axios.post(API_BASE, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("registerPlayer error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Registration failed." };
  }
};
