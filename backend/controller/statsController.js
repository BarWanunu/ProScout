const statsModel = require("../models/statsModel");

exports.getPlayerStats = async (req, res) => {
  const player_id = req.params.id;

  try {
    const stats = await statsModel.getStatsByPlayerId(player_id);

    if (!stats.success || stats.data.length === 0) {
      return res.status(404).json({
        message: "No statistics found for this player.",
      });
    }

    stats.sort((a, b) => b.season - a.season);

    res.status(200).json({
      message: "Player statistics retrieved successfully.",
      player_id,
      stats: stats.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while retrieving player statistics.", error: err.message });
  }
};
