const teamModel = require("../models/teamModel");
const { registerTeamSchema } = require("../validations/teamValidation");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkFieldExists } = require("../utils/existsUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerTeam = async (req, res) => {
  const result = await validateAndFetchUser(req, res, registerTeamSchema);
  if (!result) return;

  const { value, user } = result;
  const user_id = user.id;

  try {
    // prettier-ignore
    if (await checkFieldExists(res, teamModel.findTeamBy, "user_id", user_id)) return;
    // prettier-ignore
    if (await checkFieldExists(res, teamModel.findTeamBy, "team_name", value.team_name)) return;
    if (!checkUserRole(res, user, "team")) return;

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
