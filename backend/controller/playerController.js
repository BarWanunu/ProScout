const playerModel = require("../models/playerModel");
const userModel = require("../models/userModel");
const { createPlayerSchema } = require("../validations/playerValidation");

exports.registerPlayer = async (req, res) => {
  const { error } = createPlayerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // prettier-ignore
  const { 
        username, name, first_name, last_name, age, club, number,
        photo, position, height, weight, nationality, birthdate, video
    } = req.body

  try {
    const user = await userModel.findUserBy("username", username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_id = user.id;

    const existingPlayer = await playerModel.findPlayerByUserId(user_id);
    if (existingPlayer) {
      return res
        .status(409)
        .json({ message: "Player already exists for this user" });
    }

    // prettier-ignore
    const newPlayer = await playerModel.createPlayer({
        username, name, first_name, last_name, age, club, number,
        photo, position, height, weight, nationality, birthdate, video
    })
    res
      .status(201)
      .json({ message: "Player created successfully", player: newPlayer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
