const playerModel = require("../models/playerModel");
const statsModel = require("../models/statsModel");
//prettier-ignore
const {createPlayerSchema,updatePlayerSchema,} = require("../validations/playerValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerPlayer = async (req, res) => {
  try {
    const result = await validateAndFetchUser(req, res, createPlayerSchema);
    if (!result) return;

    const { value, user } = result;
    const user_id = req.user.id;

    if (!checkUserRole(res, user.data, "player", "register player")) return;

    if (req.file) {
      value.photo = req.file.path;
    }

    //prettier-ignore
    if (await checkFieldExists(playerModel.findPlayerBy, "user_id", user_id)) {
      return res.status(400).json({
        message: "A player profile already exists for this user.",
      });
    }

    const newPlayer = await playerModel.createPlayer({ user_id, ...value });

    if (!newPlayer.success) {
      //prettier-ignore
      return res.status(500).json({message: "Failed to create player profile."});
    }

    await statsModel.insertRandomStatsForPlayer(newPlayer.data);

    res.status(201).json({
      message: "Player profile created successfully",
      player: newPlayer.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during player registration.", error: err.message });
  }
};

exports.updatePlayerProfile = async (req, res) => {
  try {
    const result = await validateAndFetchUser(req, res, updatePlayerSchema);
    if (!result) return;

    const { value } = result;
    const user_id = req.user.id;

    if (!checkUserRole(res, req.user, "player", "update player profile"))
      return;

    if (req.file) {
      value.photo = req.file.path;
    }

    const updatedPlayer = await playerModel.updatePlayerProfile(user_id, value);

    if (!updatedPlayer.success) {
      //prettier-ignore
      return res.status(404).json({message: 'Player profile not found. Update failed.'})
    }

    res.status(200).json({
      message: "Player profile updated successfully.",
      player: updatedPlayer.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during player profile update.", error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  const user_id = req.user.id;

  try {
    const deletedPlayer = await playerModel.deletePlayerByUserId(user_id);

    if (!deletedPlayer.success) {
      //prettier-ignore
      return res.status(404).json({ message: "Player profile not found. Deletion failed." });
    }

    res.status(200).json({
      message: "Player profile deleted successfully.",
      player: deletedPlayer.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during player profile deletion.", error: err.message });
  }
};

exports.getPlayer = async (req, res) => {
  const playerId = req.params.id;

  try {
    const player = await playerModel.getPlayerById(playerId);

    if (!player.success || !player.data) {
      return res.status(404).json({ message: "Player profile wasn't found." });
    }

    //prettier-ignore
    res.status(200).json({message: 'Player profile retrieved successfully.', player: player.data });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during player profile retrieval.", error: err.message });
  }
};
