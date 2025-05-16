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

    if (!checkUserRole(res, user, "team", "register team")) return;

    if (await checkFieldExists(res, teamModel.findTeamBy, "user_id", user_id))
      //prettier-ignore
      return res.status(400).json({message: 'A team profile already exists for this user.'});

    const newTeam = await teamModel.createTeam({ user_id, ...value });

    res.status(201).json({
      message: "Team profile created successfully.",
      team: {
        user_id: newTeam.user_id,
        id: newTeam.id,
        name: newTeam.team_name,
        created_at: newTeam.create_at,
      },
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

    if (!updatedTeam) {
      //prettier-ignore
      return res.status(404).json(
        {message: `Failed to update ${field}. Team profile not found`})
    }

    res.status(200).json({
      message: `Team ${field} updated successfully.`,
      team: {
        user_id: updatedTeam.user_id,
        id: updatedTeam.id,
        name: updatedTeam.team_name,
        [field]: updatedTeam[field],
      },
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

    if (!deletedTeam) {
      //prettier-ignore
      return res.status(404).json({ message: "Team profile not found. Deletion failed" });
    }

    res.status(200).json({
      message: "Team profile deleted successfully.",
      team: {
        user_id: deletedTeam.user_id,
        id: deletedTeam.id,
        name: deletedTeam.team_name,
      },
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during team deletion.", error: err.message });
  }
};

exports.getTeam = async (req, res) => {
  const teamId = req.params.id;

  try {
    const team = await teamModel.getTeamById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team profile not found." });
    }

    //prettier-ignore
    res.status(200).json({ message: "Team profile retrieved successfully.", team: team });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during team retrieval.", error: err.message });
  }
};
