const shortlistModel = require("../models/shortlistedModel");
const { fetchUserProfile } = require("../utils/fetchUserProfile");
const { checkUserRole } = require("../utils/roleUtils");

exports.addShortlistedPlayer = async (req, res) => {
  const { player_id } = req.body;

  try {
    if (!checkUserRole(res, req.user, "team", "add a player to the shortlist"))
      return;

    const profile = await fetchUserProfile(req.user);
    const team_id = profile.id;

    const exists = await shortlistModel.isPlayerShortlisted(team_id, player_id);
    if (exists) {
      return res.status(400).json({ message: "Player already shortlisted" });
    }

    const newShortlist = await shortlistModel.addShortlistedPlayer(
      team_id,
      player_id
    );
    res
      .status(201)
      .json({ message: "Player added to shortlist", shortlist: newShortlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.removeShortlistedPlayer = async (req, res) => {
  const { player_id } = req.params;

  try {
    if (
      !checkUserRole(
        res,
        req.user,
        "team",
        "remove a player from the shortlist"
      )
    )
      return;

    const profile = await fetchUserProfile(req.user);
    const team_id = profile.id;

    const deleted = await shortlistModel.removeShortlistedPlayer(
      team_id,
      player_id
    );
    if (!deleted.length) {
      return res.status(404).json({ message: "Player not found in shortlist" });
    }

    res.status(200).json({ message: "Player removed from shortlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getShortlistedPlayers = async (req, res) => {
  try {
    const profile = await fetchUserProfile(req.user);
    const team_id = profile.id;

    const shortlistedPlayers = await shortlistModel.getShortlistedPlayers(
      team_id
    );

    if (shortlistedPlayers.length === 0) {
      return res.status(404).json({ message: "No players found in shortlist" });
    }

    res.status(200).json({ players: shortlistedPlayers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
