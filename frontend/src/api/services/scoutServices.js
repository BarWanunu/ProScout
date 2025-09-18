import { http } from "../http";

export async function registerScout(scoutData) {
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
    const res = await http.post("/api/scout", fd);
    return res.data;
  } catch (err) {
    console.error("registerScout error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Scout registration failed." };
  }
}
