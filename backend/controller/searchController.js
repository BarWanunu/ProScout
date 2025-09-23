const searchModel = require("../models/searchModel");

exports.searchPlayersByName = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Missing or empty name parameter",
    });
  }

  const result = await searchModel.searchPlayersByName(name.trim());

  if (!result.success) {
    return res.status(500).json(result);
  }

  if (result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No players found with the given name",
    });
  }

  return res.json({
    ...result,
    searchType: "name",
    matchedCriteria: { name: name.trim() },
  });
};

exports.searchTeamsByName = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Missing or empty name parameter",
    });
  }

  const result = await searchModel.searchTeamsByName(name.trim());

  if (!result.success) {
    return res.status(500).json(result);
  }

  if (result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No teams found with the given name",
    });
  }

  return res.json(result);
};

exports.advancedSearchPlayers = async (req, res) => {
  const filters = req.body;

  const result = await searchModel.advancedSearchPlayers(filters);

  if (!result.success) {
    return res.status(500).json(result);
  }

  if (result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No players matched the search criteria",
    });
  }

  return res.json({
    ...result,
    searchType: "profile",
    matchedCriteria: filters,
  });
};

exports.advancedSearchTeams = async (req, res) => {
  const filters = req.body;

  const result = await searchModel.advancedSearchTeams(filters);

  if (!result.success) {
    return res.status(500).json(result);
  }

  if (result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No teams matched the search criteria",
    });
  }

  return res.json(result);
};

exports.searchPlayersWithStats = async (req, res) => {
  const filters = req.body;

  const result = await searchModel.searchPlayersWithStats(filters);

  if (!result.success) {
    return res.status(500).json(result);
  }

  if (result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No players matched the search criteria",
    });
  }

  // Extract matched stats for each player
  const dataWithMatchedStats = result.data.map((playerStats) => {
    // Include all the stats data from the matched season
    const matchedStats = {
      season: playerStats.season,
      goals: playerStats.goals,
      assists: playerStats.assists,
      yellow_cards: playerStats.yellow_cards,
      red_cards: playerStats.red_cards,
      passes_completed: playerStats.passes_completed,
      key_passes: playerStats.key_passes,
      shots_on_target: playerStats.shots_on_target,
      dribbles_attempted: playerStats.dribbles_attempted,
      dribbles_success: playerStats.dribbles_success,
      dribble_success_rate: playerStats.dribble_success_rate,
      tackles: playerStats.tackles,
      interceptions: playerStats.interceptions,
      duels: playerStats.duels,
      duels_won: playerStats.duels_won,
      rating: playerStats.rating,
    };

    return {
      id: playerStats.id,
      name: playerStats.name,
      club: playerStats.club,
      matchedStats: matchedStats,
    };
  });

  return res.json({
    success: true,
    data: dataWithMatchedStats,
    searchType: "statistics",
    matchedCriteria: filters,
  });
};

exports.searchScoutsByName = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required for search." });
  }

  const result = await searchModel.searchScoutsByName(name.trim());

  if (!result.success) {
    return res.status(500).json({ message: result.message });
  }

  res.status(200).json({ scouts: result.data });
};
