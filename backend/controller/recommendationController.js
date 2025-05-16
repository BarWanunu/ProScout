const recommendationModel = require("../models/scoutsRecommendationModel");
const playerModel = require("../models/playerModel");
const { fetchUserProfile } = require("../utils/fetchUserProfile");

exports.createRecommendation = async (req, res) => {
  try {
    const { player_id, teams_id, recommendation_note } = req.body;

    if (req.user.role !== "scout") {
      //prettier-ignore
      return res.status(403).json({message: "Unauthorized. Only scouts can recommend players to teams."});
    }

    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile nout found." });

    const scout_id = profile.id;

    const isDuplicate = await recommendationModel.checkDuplicateRecommendation(
      player_id,
      teams_id
    );
    if (isDuplicate)
      //prettier-ignore
      return res.status(400).json({message: "This player is already been recommended to this team."});

    const newRecommendation = await recommendationModel.createRecommendation(
      scout_id,
      player_id,
      teams_id,
      recommendation_note
    );
    res.status(201).json({
      message: "Recommendation created successfully.",
      recommendation: newRecommendation,
    });
  } catch (err) {
    //prettier-ignore
    return res.status(500).json({ message: "Server error during recommendation creation.", error: err.message });
  }
};

exports.deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    if (!["scout", "team"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only scouts and teams are able to delete recommendations.",
      });
    }

    const recommendation = await recommendationModel.getRecommendationsById(id);
    if (!recommendation)
      return res.status(404).json({ message: "Recommendation not found." });

    const isScoutDeleting =
      req.user.role === "scout" && recommendation.scout_id === profile.id;
    const isTeamDeleting =
      req.user.role === "team" && recommendation.teams_id === profile.id;

    if (!isScoutDeleting && !isTeamDeleting) {
      //prettier-ignore
      return res.status(403).json({ message: "Unauthorized to delete this recommendation." });
    }

    //prettier-ignore
    const deleted = await recommendationModel.deleteRecommendation(id, profile.id);
    if (!deleted)
      //prettier-ignore
      return res.status(404).json({ message: "Failed to delete recommendation." });

    return res.status(200).json({
      message: "Recommendation deleted successfully.",
      recommendation: deleted,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Server error during recommendation deletion.", error: err.message });
  }
};

exports.getRecommendationByPlayerId = async (req, res) => {
  try {
    const { player_id } = req.params;

    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    const player = await playerModel.findPlayerBy("id", player_id);
    if (!player) {
      //prettier-ignore
      return res.status(403).json({ message: "No player with this id exists." });
    }
    const isPlayer =
      req.user.role === "player" && profile.id === parseInt(player_id);
    const isScout = req.user.role === "scout";

    if (!isPlayer && !isScout) {
      //prettier-ignore
      return res.status(403).json({ message: "Unauthorized to view this player's recommendations." });
    }

    //prettier-ignore
    const recommendations =await recommendationModel.getRecommendationsByPlayerId(player_id);

    res.status(200).json({
      message: "Player recommendations retrieved successfully.",
      recommendations,
    });
  } catch (err) {
    //prettier-ignore
    return res.status(500).json({ message: "Server error during recommendation retrieval.", error: err.message });
  }
};

exports.getRecommendationsByTeam = async (req, res) => {
  try {
    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    if (req.user.role !== "team") {
      //prettier-ignore
      return res.status(403).json({ message: "Only teams can view their recommendations." });
    }

    //prettier-ignore
    const recommendations = await recommendationModel.getRecommendationsByTeamId(profile.id);
    res.status(200).json({
      message: "Team recommendations retrieved successfully.",
      recommendations,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Server error during team recommendations retrieval.", error: err.message });
  }
};

exports.getRecommendationsByScout = async (req, res) => {
  try {
    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    if (req.user.role !== "scout") {
      //prettier-ignore
      return res.status(403).json({ message: "Unauthorized to view these scout recommendations." });
    }

    //prettier-ignore
    const recommendations = await recommendationModel.getRecommendationsByScoutId(profile.id);
    res.status(200).json({
      message: "Scout recommendations retrieved successfully.",
      recommendations,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Server error during scout recommendations retrieval.", error: err.message });
  }
};
