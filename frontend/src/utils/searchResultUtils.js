export const getUserTypeFromResult = (result) => {
  if (result.player) {
    return "player";
  }
  if (result.team_name || result.league || result.formation) {
    return "team";
  }
  if (
    result.scout ||
    (result.first_name && result.last_name && result.experience_years)
  ) {
    return "scout";
  }
  return "unknown";
};

export const normalizeSearchResult = (result) => {
  const userType = getUserTypeFromResult(result);

  switch (userType) {
    case "player":
      return {
        type: "player",
        id: result.player?.id || result.id,
        name: result.player?.name || result.name,
        photo: result.player?.photo,
        position: result.player?.position,
        club: result.player?.club || result.club,
        age: result.player?.age,
        nationality: result.player?.nationality,
        number: result.player?.number,
        stats: result.stats,
        matchedCriteria: result.matchedCriteria,
        matchedStats: result.matchedStats,
        searchType: result.searchType,
        originalResult: result,
      };

    case "team":
      return {
        type: "team",
        id: result.id,
        name: result.team_name,
        logo: result.logo,
        country: result.country,
        league: result.league,
        formation: result.formation,
        stadium: result.stadium,
        trophies: result.trophies,
        originalResult: result,
      };

    case "scout":
      return {
        type: "scout",
        id: result.scout?.id || result.id,
        name: `${result.first_name} ${result.last_name}`,
        photo: result.image,
        nationality: result.nationality,
        experienceYears: result.experience_years,
        phone: result.phone,
        userId: result.user_id,
        originalResult: result,
      };

    default:
      return {
        type: "unknown",
        id: result.id,
        name: result.name,
        originalResult: result,
      };
  }
};

export const getUserTypeIcon = (userType) => {
  switch (userType) {
    case "player":
      return "⚽";
    case "team":
      return "🏆";
    case "scout":
      return "🔍";
    default:
      return "👤";
  }
};

export const getUserTypeColor = (userType) => {
  switch (userType) {
    case "player":
      return "#28a745";
    case "team":
      return "#007bff";
    case "scout":
      return "#6f42c1";
    default:
      return "#6c757d";
  }
};
