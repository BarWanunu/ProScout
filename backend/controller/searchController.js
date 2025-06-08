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

  return res.json(result);
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

  return res.json(result);
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

  return res.json(result);
};

exports.searchScoutsByName = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required for search." });
  }

  if (!result.success) {
    return res.status(500).json({ message: result.message });
  }

  res.status(200).json({ scouts: result.data });
};
