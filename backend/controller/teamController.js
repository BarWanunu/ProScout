const teamModel = require("../models/teamModel");
//prettier-ignore
const {registerTeamSchema} = require("../validations/teamValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { checkUserRole } = require("../utils/roleUtils");
const { getImagePath } = require("../utils/imageUtils");

exports.registerTeam = async (req, res) => {
  try {
    const user_id = req.user.id;
    let value = { ...req.body };

    value.logo = req.file ? getImagePath(req.file) : "";

    ["team_name", "league", "country", "formation", "stadium"].forEach(
      (field) => {
        if (value[field]) value[field] = String(value[field]);
      }
    );

    if (value.trophies) {
      value.trophies = parseInt(value.trophies);
      if (isNaN(value.trophies)) {
        return res.status(400).json({ message: "Trophies must be a number" });
      }
    }

    const { error } = registerTeamSchema.validate(value);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!checkUserRole(res, req.user, "team", "register team")) return;

    if (await checkFieldExists(teamModel.findTeamBy, "user_id", user_id))
      //prettier-ignore
      return res.status(400).json({message: 'A team profile already exists for this user.'});

    const newTeam = await teamModel.createTeam({ user_id, ...value });

    //prettier-ignore
    if (!newTeam.success) {
      return res.status(500).json({message: "Failed to create team profile.",});
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
    const user_id = req.user.id;
    let field, newValue;

    if (req.file) {
      field = "logo";
      newValue = getImagePath(req.file);
    } else {
      field = req.body.field;
      newValue = req.body.value;

      if (!field) {
        return res.status(400).json({ message: "Field is required." });
      }

      if (field === "trophies") {
        newValue = parseInt(newValue);
        if (isNaN(newValue)) {
          return res.status(400).json({ message: "Trophies must be a number" });
        }
      } else if (
        //prettier-ignore
        ["formation", "stadium"].includes(field)
      ) {
        newValue = newValue ? String(newValue) : "";
        if (!newValue) {
          //prettier-ignore
          return res.status(400).json({ message: `${field} must be a non-empty string` });
        }
      } else {
        //prettier-ignore
        return res.status(400).json({ message: `Invalid field: ${field}. Must be one of : stadium, formation, logo, trophies` });
      }
    }

    if (!checkUserRole(res, req.user, "team", "update team field")) return;

    //prettier-ignore
    const updatedTeam = await teamModel.updateTeamField(user_id, field, newValue);

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
