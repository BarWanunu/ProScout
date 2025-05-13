const statsModel = require("../models/statsModel");

exports.getPlayerStats = async (req, res) => {
  const player_id = req.params.id;

  try {
    const stats = await statsModel.getStatsByPlayerId(player_id);

    if (!stats || stats.length === 0) {
      return res
        .status(404)
        .json({ message: "Stats not found for this player." });
    }

    stats.sort((a, b) => b.season - a.season);

    res.status(200).json({ stats });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
