const playerModel = require("../models/playerModel");
const statsModel = require("../models/statsModel");
const {
  createPlayerSchema,
  updatePlayerSchema,
} = require("../validations/playerValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerPlayer = async (req, res) => {
  try {
    const result = await validateAndFetchUser(req, res, createPlayerSchema);
    if (!result) return;

    const { value, user } = result;
    const user_id = req.user.id;

    if (!checkUserRole(res, user, "player", "register player")) return;

    //prettier-ignore
    if (await checkFieldExists(res, playerModel.findPlayerBy, "user_id", user_id)) {
      return res.status(400).json({
        message: "A player profile already exists for this user.",
      });
    }

    const newPlayer = await playerModel.createPlayer({ user_id, ...value });

    await statsModel.insertRandomStatsForPlayer(newPlayer);

    res.status(201).json({
      message: "Player profile created successfully",
      player: {
        user_id: newPlayer.user_id,
        id: newPlayer.id,
        name: newPlayer.name,
        position: newPlayer.position,
        created_at: newPlayer.created_at,
      },
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

    const updatedPlayer = await playerModel.updatePlayerProfile(user_id, value);

    if (!updatedPlayer) {
      //prettier-ignore
      return res.status(404).json({message: 'Player profile not found. Update failed.'})
    }

    res.status(200).json({
      message: "Player profile updated successfully.",
      player: {
        user_id: updatedPlayer.user_id,
        id: updatedPlayer.id,
        name: updatedPlayer.name,
        ...value,
      },
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

    if (!deletedPlayer) {
      return res
        .status(404)
        .json({ message: "Player profile not found. Deletion failed." });
    }

    res.status(200).json({
      message: "Player profile deleted successfully.",
      player: {
        user_id: deletedPlayer.user_id,
        id: deletedPlayer.id,
        name: deletedPlayer.name,
      },
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

    if (!player) {
      return res.status(404).json({ message: "Player profile wasn't found." });
    }

    //prettier-ignore
    res.status(200).json({message: 'Player profile retrieved successfully.', player });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during player profile retrieval.", error: err.message });
  }
};
