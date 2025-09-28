// Get appropriate image for user based on role
export const getUserImageUrl = (user) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!user || !user.role) {
    return null;
  }

  let imageField = null;
  let defaultImage = null;
  switch (user.role) {
    case "player":
      imageField = user.photo;
      defaultImage = "/default-player.jpg";
      break;
    case "team":
      imageField = user.logo;
      defaultImage = "/default-team.jpg";
      break;
    case "scout":
      imageField = user.image;
      defaultImage = "/default-scout.jpg";
      break;
    default:
      return null;
  }

  if (imageField) {
    if (imageField.startsWith("http")) {
      return imageField;
    }
    return `${baseUrl}/${imageField}`;
  }

  return defaultImage;
};

export const getUserInitials = (user) => {
  if (!user) return "U";

  const name =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username || "Unknown User";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};
