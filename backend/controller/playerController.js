const playerModel = require("../models/playerModel");
const { createPlayerSchema } = require("../validations/playerValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerPlayer = async (req, res) => {
  const result = await validateAndFetchUser(req, res, createPlayerSchema);
  if (!result) return;

  const { value, user } = result;
  const user_id = user.id;

  try {
    // prettier-ignore
    if (await checkFieldExists(res, playerModel.findPlayerBy, "user_id", user_id))
      return;
    if (!checkUserRole(res, user, "player")) return;

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
