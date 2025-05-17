const teamModel = require("../models/teamModel");
const {
  registerTeamSchema,
  updateTeamFieldSchema,
} = require("../validations/teamValidation");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkFieldExists } = require("../utils/existsUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerTeam = async (req, res) => {
  try {
    const result = await validateAndFetchUser(req, res, registerTeamSchema);
    if (!result) return;

    const { value, user } = result;
    const user_id = req.user.id;

    if (!checkUserRole(res, user.data, "team", "register team")) return;

    if (await checkFieldExists(teamModel.findTeamBy, "user_id", user_id))
      //prettier-ignore
      return res.status(400).json({message: 'A team profile already exists for this user.'});

    const newTeam = await teamModel.createTeam({ user_id, ...value });

    if (!newTeam.success) {
      return res.status(500).json({
        message: "Failed to create team profile.",
      });
    }

    res.status(201).json({
      message: "Team profile created successfully.",
      team: newTeam.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during team registration.", error: err.message });
  }
};

exports.updateTeamField = async (req, res) => {
  try {
    const result = await validateAndFetchUser(req, res, updateTeamFieldSchema);
    if (!result) return;

    const { field, value: newValue } = result.value;
    const user_id = req.user.id;

    if (!checkUserRole(res, req.user, "team", "update team field")) return;

    //prettier-ignore
    const updatedTeam = await teamModel.updateTeamField(user_id, field,newValue);

    if (!updatedTeam.success) {
      return res.status(500).json({
        message: "Failed to update team profile.",
      });
    }

    res.status(200).json({
      message: `Team ${field} updated successfully.`,
      team: updatedTeam.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during team field update.", error: err.message });
  }
};

exports.deleteTeam = async (req, res) => {
  const user_id = req.user.id;

  try {
    const deletedTeam = await teamModel.deleteTeamByUserId(user_id);

    if (!deletedTeam.success) {
      //prettier-ignore
      return res.status(404).json({ message: "Team profile not found. Deletion failed" });
    }

    res.status(200).json({
      message: "Team profile deleted successfully.",
      team: deletedTeam.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during team deletion.", error: err.message });
  }
};

exports.getTeam = async (req, res) => {
  const teamId = req.params.id;

  try {
    const team = await teamModel.findTeamBy("id", teamId);

    if (!team.success) {
      //prettier-ignore
      return res.status(404).json({ message: "Team profile not found." });
    }

    //prettier-ignore
    res.status(200).json({ message: "Team profile retrieved successfully.", team: team.data });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during team retrieval.", error: err.message });
  }
};
