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

    if (!checkUserRole(res, user.data, "scout", "register scout")) return;

    //prettier-ignore
    if( await checkFieldExists(scoutModel.findScoutBy, "user_id", user_id)) {
      //prettier-ignore
      return res.status(400).json({ message: 'A scout profile already exists for this user.' });
    }

    const newScout = await scoutModel.createScout({ user_id, ...value });

    if (!newScout.success) {
      return res.status(500).json({
        message: "Failed to create scout profile.",
      });
    }

    res.status(201).json({
      message: "Scout created successfully",
      scout: newScout.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during scout registration." });
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

    if (!updatedScout.success) {
      return res.status(404).json({
        message: `Failed to update ${field}. Scout profile not found.`,
      });
    }
    res.status(200).json({
      message: `Scout ${field} updated successfully.`,
      scout: updatedScout.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during scout field update." });
  }
};

exports.deleteScout = async (req, res) => {
  const user_id = req.user.id;

  try {
    const deletedScout = await scoutModel.deleteScoutByUserId(user_id);

    if (!deletedScout.success) {
      //prettier-ignore
      return res.status(404).json({ message: "Scout profile not found. Deletion failed." });
    }

    res.status(200).json({
      message: "Scout profile deleted successfully.",
      scout: deletedScout.data,
    });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during scout deletion." });
  }
};
