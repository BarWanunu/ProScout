const playerModel = require("../models/playerModel");
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
  const user_id = user.id;

  try {
    if (!checkUserRole(res, user, "player")) return;
    // prettier-ignore
    if (await checkFieldExists(res, playerModel.findPlayerBy, "user_id", user_id))
      return;

    // prettier-ignore
    const newPlayer = await playerModel.createPlayer({
        user_id, ...value
    })
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

  const { value, user } = result;

  try {
    const updatedPlayer = await playerModel.updatePlayerProfile(user.id, value);

    res.status(200).json({
      message: "Player profile updated successfully.",
      player: updatedPlayer,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  const userId = req.user.id;
  try {
    const deletedPlayer = await playerModel.deletePlayerByUserId(userId);

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
