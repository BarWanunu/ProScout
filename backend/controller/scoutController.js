const scoutModel = require("../models/scoutModel");
const {
  createScoutSchema,
  updateScoutFieldSchema,
} = require("../validations/scoutValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerScout = async (req, res) => {
  try {
    const result = await validateAndFetchUser(req, res, createScoutSchema);
    if (!result) return;

    const { value, user } = result;
    const user_id = req.user.id;

    if (!checkUserRole(res, user, "scout", "register scout")) return;

    if (await checkFieldExists(res, scoutModel.findScoutBy, "user_id", user_id))
      //prettier-ignore
      return res.status(400).json({message: 'A scout profile already exists for this user.'});

    const newScout = await scoutModel.createScout({ user_id, ...value });

    res.status(201).json({
      message: "Scout created successfully",
      scout: {
        user_id: newScout.user_id,
        id: newScout.id,
        first_name: newScout.first_name,
        last_name: newScout.last_name,
        experience_years: newScout.experience_years,
        created_at: newScout.created_at,
      },
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during scout registration.", error: err.message });
  }
};

exports.updateScoutField = async (req, res) => {
  try {
    const result = await validateAndFetchUser(req, res, updateScoutFieldSchema);
    if (!result) return;

    const { field, value: newValue } = result.value;
    const user_id = req.user.id;

    //prettier-ignore
    const updatedScout = await scoutModel.updateScoutField(user_id, field, newValue);

    if (!updatedScout) {
      return res.status(404).json({
        message: `Failed to update ${field}. Scout profile not found.`,
      });
    }
    res.status(200).json({
      message: `Scout ${field} updated successfully.`,
      scout: {
        user_id: updatedScout.user_id,
        id: updatedScout.id,
        first_name: newScout.first_name,
        last_name: newScout.last_name,
        [field]: updatedScout[field],
      },
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during scout field update.", error: err.message });
  }
};

exports.deleteScout = async (req, res) => {
  const user_id = req.user.id;

  try {
    const deletedScout = await scoutModel.deleteScoutByUserId(user_id);

    if (!deletedScout) {
      return res
        .status(404)
        .json({ message: "Scout profile not found. Deletion failed." });
    }

    res.status(200).json({
      message: "Scout profile deleted successfully.",
      scout: deletedScout,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during scout deletion.", error: err.message });
  }
};
