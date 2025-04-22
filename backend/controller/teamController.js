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
  const user_id = user.id;

  try {
    if (!checkUserRole(res, user, "team")) return;
    // prettier-ignore
    if (await checkFieldExists(res, teamModel.findTeamBy, "user_id", user_id)) return;
    // prettier-ignore
    if (await checkFieldExists(res, teamModel.findTeamBy, "team_name", value.team_name)) return;

    // prettier-ignore
    const newTeam = await teamModel.createTeam({user_id, ...value});
    res
      .status(201)
      .json({ message: "Team created successfully.", team: newTeam });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.updateTeamField = async (req, res) => {
  // prettier-ignore
  const result = await validateAndFetchUser(req, res, updateTeamFieldSchema);
  if (!result) return;

  const {
    value: { field, value: newValue },
    user,
  } = result;

  try {
    // prettier-ignore
    const updatedTeam = await teamModel.updateTeamField(
      user.id,field,newValue);

    // prettier-ignore
    res.status(200).json({
        message: `Team ${field} updated successfully.`,
        team: updatedTeam,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.deleteTeam = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedTeam = await teamModel.deleteTeamByUserId(userId);

    if (!deletedTeam) {
      return res.status(404).json({ message: "Team profile not found." });
    }

    res.status(200).json({
      message: "Team profile deleted successfully.",
      team: deletedTeam,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
