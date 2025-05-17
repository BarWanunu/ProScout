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
    if (!exists.success || exists.data) {
      //prettier-ignore
      return res.status(400).json({ message: "Player is already in the shortlist." });
    }

    //prettier-ignore
    const newShortlist = await shortlistModel.addShortlistedPlayer(team_id, player_id);

    if (!newShortlist.success) {
      //prettier-ignore
      return res.status(500).json({message: 'Failed to add player to shortlist.'})
    }

    //prettier-ignore
    res.status(201).json({ message: "Player successfully added to shortlist", shortlist: newShortlist.data });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while adding player to shortlist.", error: err.message });
  }
};

exports.removeShortlistedPlayer = async (req, res) => {
  const { player_id } = req.params;

  try {
    //prettier-ignore
    if (!checkUserRole(res, req.user, "team","remove a player from the shortlist."))
      return;

    const profile = await fetchUserProfile(req.user);
    const team_id = profile.id;

    //prettier-ignore
    const deleted = await shortlistModel.removeShortlistedPlayer(team_id,player_id);
    if (!deleted.success || deleted.data.length === 0) {
      //prettier-ignore
      return res.status(404).json({message: "Player not found in the shortlist",});
    }

    //prettier-ignore
    res.status(200).json({message: "Player successfully removed from shortlist",});
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while removing player from shortlist.", error: err.message });
  }
};

exports.getShortlistedPlayers = async (req, res) => {
  try {
    if (!checkUserRole(res, req.user, "team", "get the shortlist.")) return;

    const profile = await fetchUserProfile(req.user);
    const team_id = profile.id;

    //prettier-ignore
    const shortlistedPlayers = await shortlistModel.getShortlistedPlayers(team_id);

    if (!shortlistedPlayers.success || shortlistedPlayers.data.length === 0) {
      //prettier-ignore
      return res.status(404).json({message: "No players found in the shortlist.",});
    }

    res.status(200).json({
      message: "Shortlisted players retrieved successfully.",
      players: shortlistedPlayers.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error while retrieving shortlisted players.", error: err.message });
  }
};
