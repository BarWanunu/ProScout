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
  const result = await validateAndFetchUser(req, res, createPlayerSchema);
  if (!result) return;

  const { value, user } = result;
  const user_id = req.user.id;

  try {
    if (!checkUserRole(res, user, "player")) return;

    if (
      await checkFieldExists(res, playerModel.findPlayerBy, "user_id", user_id)
    )
      return;
    const newPlayer = await playerModel.createPlayer({ user_id, ...value });
    await statsModel.insertRandomStatsForPlayer(newPlayer);

    res
      .status(201)
      .json({ message: "Player created successfully", player: newPlayer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updatePlayerProfile = async (req, res) => {
  const result = await validateAndFetchUser(req, res, updatePlayerSchema);
  if (!result) return;

  const { value } = result;
  const user_id = req.user.id;

  try {
    if (!checkUserRole(res, req.user, "player", "update player profile"))
      return;

    const updatedPlayer = await playerModel.updatePlayerProfile(user_id, value);

    res.status(200).json({
      message: "Player profile updated successfully.",
      player: updatedPlayer,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  const user_id = req.user.id;

  try {
    const deletedPlayer = await playerModel.deletePlayerByUserId(user_id);

    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player profile not found." });
    }

    res.status(200).json({
      message: "Player profile deleted successfully.",
      player: deletedPlayer,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPlayer = async (req, res) => {
  const playerId = req.params.id;

  try {
    const player = await playerModel.getPlayerById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player profile wasn't found." });
    }

    res.status(200).json({ player });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
