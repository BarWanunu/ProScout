import { http } from "../api/http";

export async function registerTeam(teamData) {
  const fd = new FormData();

  fd.append("team_name", teamData.team_name);
  fd.append("league", teamData.league);
  fd.append("country", teamData.country);
  fd.append("formation", teamData.formation);
  fd.append("stadium", teamData.stadium);
  fd.append(
    "trophies",
    teamData.trophies !== undefined && teamData.trophies !== ""
      ? String(teamData.trophies)
      : "0"
  );

  const logoFile = teamData.logo?.originFileObj || teamData.logo || null;
  if (logoFile) fd.append("logo", logoFile);

  try {
    const res = await http.post("/api/team", fd);
    return res.data;
  } catch (err) {
    console.error("registerTeam error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Team registration failed." };
  }
}
