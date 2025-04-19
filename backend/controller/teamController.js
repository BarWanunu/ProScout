const teamModel = require("../models/teamModel");
const userModel = require("../models/userModel");
const { registerTeamSchema } = require("../validations/teamValidation");

exports.registerTeam = async (req, res) => {
  const { error } = registerTeamSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const {
    username,
    team_name,
    league,
    country,
    formation,
    stadium,
    trophies,
    logo,
  } = req.body;

  try {
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_id = user.id;

    const existingTeam = await teamModel.findTeamByUserIdOrName(
      user_id,
      team_name
    );
    if (existingTeam) {
      return res
        .status(409)
        .json({ message: "Team name or user already exists" });
    }

    const newTeam = await teamModel.createTeam({
      user_id,
      team_name,
      league,
      country,
      formation,
      stadium,
      trophies,
      logo,
    });
    res
      .status(201)
      .json({ message: "Team created successfully", team: newTeam });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
