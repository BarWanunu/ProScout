const teamModel = require("../models/teamModel");
const {
  registerTeamSchema,
  updateTeamFieldSchema,
} = require("../validations/teamValidation");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkFieldExists } = require("../utils/existsUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerTeam = async (req, res) => {
  const result = await validateAndFetchUser(req, res, registerTeamSchema);
  if (!result) return;

  const { value, user } = result;
  const user_id = req.user.id;

  try {
    if (!checkUserRole(res, user, "team")) return;

    if (await checkFieldExists(res, teamModel.findTeamBy, "user_id", user_id))
      return;

    const newTeam = await teamModel.createTeam({ user_id, ...value });

    res
      .status(201)
      .json({ message: "Team created successfully.", team: newTeam });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateTeamField = async (req, res) => {
  const result = await validateAndFetchUser(req, res, updateTeamFieldSchema);
  if (!result) return;

  const { field, value: newValue } = result.value;
  const user_id = req.user.id;

  try {
    if (!checkUserRole(res, req.user, "team", "update team field")) return;

    const updatedTeam = await teamModel.updateTeamField(
      user_id,
      field,
      newValue
    );

    res.status(200).json({
      message: `Team ${field} updated successfully.`,
      team: updatedTeam,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteTeam = async (req, res) => {
  const user_id = req.user.id;

  try {
    const deletedTeam = await teamModel.deleteTeamByUserId(user_id);

    if (!deletedTeam) {
      return res.status(404).json({ message: "Team profile not found." });
    }

    res.status(200).json({
      message: "Team profile deleted successfully.",
      team: deletedTeam,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTeam = async (req, res) => {
  const teamId = req.params.id;

  try {
    const team = await teamModel.getTeamById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team profile wasn't found." });
    }

    res.status(200).json({ team });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
