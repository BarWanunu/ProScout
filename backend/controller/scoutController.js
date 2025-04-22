// prettier-ignore
const {createScoutSchema,updateScoutFieldSchema,} = require("../validations/scoutValidation");
const scoutModel = require("../models/scoutModel");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateAndFetchUser } = require("../utils/controllerUtils");
const { checkUserRole } = require("../utils/roleUtils");

exports.registerScout = async (req, res) => {
  const result = await validateAndFetchUser(req, res, createScoutSchema);
  if (!result) return;

  const { value, user } = result;

  const user_id = user.id;
  try {
    if (!checkUserRole(res, user, "scout")) return;
    if (await checkFieldExists(res, scoutModel.findScoutBy, "user_id", user_id))
      return;
    if (
      await checkFieldExists(res, scoutModel.findScoutBy, "phone", value.phone)
    )
      return;

    // prettier-ignore
    const newScout = await scoutModel.createScout({user_id, ...value,});
    res
      .status(201)
      .json({ message: "Scout created successfully", scout: newScout });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.updateScoutField = async (req, res) => {
  const result = await validateAndFetchUser(req, res, updateScoutFieldSchema);
  if (!result) return;

  // prettier-ignore
  const { value: {field, value: newValue}, user } = result;

  try {
    const updatedScout = await scoutModel.updateScoutField(
      user.id,
      field,
      newValue
    );

    res.status(200).json({
      message: `Scout ${field} updated successfully.`,
      scout: updatedScout,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
