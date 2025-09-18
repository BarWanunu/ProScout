import { http } from "../http";

export const registerPlayer = async (profileData) => {
  const fd = new FormData();

  fd.append("name", profileData.name);
  fd.append("first_name", profileData.first_name);
  fd.append("last_name", profileData.last_name);
  fd.append(
    "age",
    profileData.age !== undefined && profileData.age !== ""
      ? String(profileData.age)
      : ""
  );
  fd.append("club", profileData.club ?? "Free Agent");
  fd.append(
    "number",
    profileData.number !== undefined && profileData.number !== ""
      ? String(profileData.number)
      : ""
  );
  fd.append("position", profileData.position);

  fd.append(
    "height",
    profileData.height !== undefined && profileData.height !== ""
      ? `${profileData.height}`
      : ""
  );
  fd.append(
    "weight",
    profileData.weight !== undefined && profileData.weight !== ""
      ? `${profileData.weight}`
      : ""
  );
  fd.append("nationality", profileData.nationality);
  fd.append("birthdate", profileData.birthdate);

  const photoFile =
    profileData.photo?.originFileObj || profileData.photo || null;
  const videoFile =
    profileData.video?.originFileObj || profileData.video || null;
  if (photoFile) fd.append("photo", photoFile);
  if (videoFile) fd.append("video", videoFile);

  try {
    const res = await http.post("/api/player", fd);
    return res.data;
  } catch (err) {
    console.error("registerPlayer error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Registration failed." };
  }
};
