const ShortlistedPlayer = require("../models/shortlistedPlayerModel");
const { checkUserRole } = require("../utils/roleUtils");

exports.addShortlistedPlayer = async (req, res) => {
  const { player_id } = req.body;
  const team_id = req.user.id;

  if (!checkUserRole(res, req.user, "team", "add a player to shortlist"))
    return;

  try {
    const exists = await ShortlistedPlayer.isPlayerShortlisted(
      team_id,
      player_id
    );
    if (exists)
      return res.status(400).json({ message: "Player already shortlisted." });

    // prettier-ignore
    const newPlayer = await ShortlistedPlayer.addShortlistedPlayer(team_id,player_id);
    //prettier-ignore
    res.status(201).json({
        message: "Player added to the shortlist successfully",
        player: newPlayer,
      });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Error adding player to shortlist", error: err.message });
  }
};

exports.removeShortlistedPlayer = async (req, res) => {
  const { team_id, player_id } = req.params;

  try {
    const removed = await ShortlistedPlayer.removeShortlistedPlayer(
      team_id,
      player_id
    );
    if (!removed)
      return res.status(404).json({ message: "Player not found in shortlist" });

    res.status(200).json({ message: "Player removed from shortlist" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing player", error: err.message });
  }
};

exports.getShortlistedPlayers = async (req, res) => {
  const { team_id } = req.params;

  try {
    const players = await ShortlistedPlayer.getShortlistedPlayers(team_id);
    res.status(200).json(players);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error retrieving shortlisted players",
        error: err.message,
      });
  }
};
