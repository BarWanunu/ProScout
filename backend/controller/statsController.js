const statsModel = require("../models/statsModel");

exports.getPlayerStats = async (req, res) => {
  const playerId = req.params.id;

  try {
    const stats = await statsModel.getStatsByPlayerId(playerId);

    if (!stats || stats.length === 0) {
      return res
        .status(404)
        .json({ message: "Stats not found for this player." });
    }

    res.status(200).json({ stats });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
