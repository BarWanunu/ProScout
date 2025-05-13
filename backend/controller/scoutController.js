const scoutModel = require("../models/scoutModel");
const {
  createScoutSchema,
  updateScoutFieldSchema,
} = require("../validations/scoutValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerScout = async (req, res) => {
  const result = await validateAndFetchUser(req, res, createScoutSchema);
  if (!result) return;

  const { value, user } = result;
  const user_id = req.user.id;

  try {
    if (!checkUserRole(res, user, "scout")) return;

    if (await checkFieldExists(res, scoutModel.findScoutBy, "user_id", user_id))
      return;

    const newScout = await scoutModel.createScout({ user_id, ...value });

    res
      .status(201)
      .json({ message: "Scout created successfully", scout: newScout });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateScoutField = async (req, res) => {
  const result = await validateAndFetchUser(req, res, updateScoutFieldSchema);
  if (!result) return;

  const { field, value: newValue } = result.value;
  const user_id = req.user.id;

  try {
    const updatedScout = await scoutModel.updateScoutField(
      user_id,
      field,
      newValue
    );

    res.status(200).json({
      message: `Scout ${field} updated successfully.`,
      scout: updatedScout,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteScout = async (req, res) => {
  const user_id = req.user.id;

  try {
    const deletedScout = await scoutModel.deleteScoutByUserId(user_id);

    if (!deletedScout) {
      return res.status(404).json({ message: "Scout profile not found." });
    }

    res.status(200).json({
      message: "Scout profile deleted successfully.",
      scout: deletedScout,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
