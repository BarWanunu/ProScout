// services/teamServices.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/team";

export async function registerTeam(teamData, token) {
  const fd = new FormData();

  // נשלח תמיד מחרוזת (גם אם ריק) כדי לא להכניס NULL לעמודות NOT NULL
  fd.append("team_name", teamData.team_name);
  fd.append("league", teamData.league);
  fd.append("country", teamData.country);
  fd.append("formation", teamData.formation);
  fd.append("stadium", teamData.stadium);
  fd.append("trophies", 0);

  // קובץ לוגו (multer.single("logo"))
  const logoFile = teamData.logo?.originFileObj || teamData.logo || null;
  if (logoFile) fd.append("logo", logoFile);

  try {
    const res = await axios.post(API_BASE, fd, {
      headers: { Authorization: `Bearer ${token}` }, // אל תקבע Content-Type ידנית
    });
    return res.data;
  } catch (err) {
    console.error("registerTeam error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Team registration failed." };
  }
}
