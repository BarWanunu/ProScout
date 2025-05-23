const playerModel = require("../models/playerModel");
const statsModel = require("../models/statsModel");
//prettier-ignore
const {createPlayerSchema,updatePlayerSchema,} = require("../validations/playerValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { checkUserRole } = require("../utils/roleUtils");
const { getImagePath } = require("../utils/imageUtils");

exports.registerPlayer = async (req, res) => {
  try {
    const user_id = req.user.id;
    let value = { ...req.body };

    value.photo = req.file ? getImagePath(req.file) : "";

    //prettier-ignore
    ["name", "first_name", "last_name", "club", "height", "weight", "position", "nationality", "video"].forEach((field) => {
      if (value[field] !== undefined) value[field] = String(value[field]);
      if (field === 'height') {
        value.height = value.height + ' cm'
      }
      if (field === 'weight') {
        value.weight = value.weight + ' kg'
      }
    });

    if (typeof value.age !== "undefined") {
      value.age = parseInt(value.age);
      if (isNaN(value.age)) {
        return res.status(400).json({ message: "Age must be a number" });
      }
    }

    if (typeof value.number !== "undefined") {
      value.number = parseInt(value.number);
      if (isNaN(value.number)) {
        return res.status(400).json({ message: "Kit number must be a number" });
      }
    }

    if (value.birthdate) {
      const birthdate = new Date(value.birthdate);
      if (isNaN(birthdate.getTime())) {
        //prettier-ignore
        return res.status(400).json({message: "Invalid birthdate format. Please use YYYY-MM-DD.",});
      }
      value.birthdate = birthdate.toISOString().split("T")[0];
    }

    const { error } = createPlayerSchema.validate(value);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!checkUserRole(res, req.user, "player", "register player")) return;

    //prettier-ignore
    if (await checkFieldExists(playerModel.findPlayerBy, "user_id", user_id)) {
      return res.status(400).json({
        message: "A player profile already exists for this user.",
      });
    }

    const newPlayer = await playerModel.createPlayer({ user_id, ...value });

    if (!newPlayer.success) {
      //prettier-ignore
      return res.status(500).json({message: "Failed to create player profile.", error : newPlayer.error});
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
    const user_id = req.user.id;
    let value = { ...req.body };

    if (req.file) {
      value.photo = getImagePath(req.file);
    }

    ["club", "height", "weight", "position", "video"].forEach((field) => {
      if (value[field] !== undefined) value[field] = String(value[field]);
      if (field === "height") {
        value.height = value.height + " cm";
      }
      if (field === "weight") {
        value.weight = value.weight + " kg";
      }
    });

    if (typeof value.age !== "undefined") {
      value.age = parseInt(value.age);
      if (isNaN(value.age)) {
        return res.status(400).json({ message: "Age must be a number" });
      }
    }

    if (typeof value.number !== "undefined") {
      value.number = parseInt(value.number);
      if (isNaN(value.number)) {
        return res.status(400).json({ message: "Kit number must be a number" });
      }
    }

    const restrictedFields = [
      "birthdate",
      "nationality",
      "name",
      "first_name",
      "last_name",
    ];
    for (const field of restrictedFields) {
      if (value[field] !== undefined) {
        return res
          .status(400)
          .json({ message: `${field} cannot be updated directly.` });
      }
    }

    const { error } = updatePlayerSchema.validate(value);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!checkUserRole(res, req.user, "player", "update player profile"))
      return;

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
    const player = await playerModel.findPlayerBy("id", playerId);

    if (!player.success || !player.data) {
      return res.status(404).json({ message: "Player profile not found." });
    }

    //prettier-ignore
    res.status(200).json({message: 'Player profile retrieved successfully.', player: player.data });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during player profile retrieval.", error: err.message });
  }
};
