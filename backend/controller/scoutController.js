const scoutModel = require("../models/scoutModel");
//prettier-ignore
const {createScoutSchema} = require("../validations/scoutValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { checkUserRole } = require("../utils/roleUtils");
const { getImagePath } = require("../utils/imageUtils");

exports.registerScout = async (req, res) => {
  try {
    const user_id = req.user.id;
    let value = { ...req.body };

    value.image = req.file ? getImagePath(req.file) : "";

    ["first_name", "last_name", "nationality", "phone"].forEach((field) => {
      if (value[field] !== undefined) value[field] = String(value[field]);
    });

    //prettier-ignore
    if (typeof value.experience_years !== "undefined" && value.experience_years !== "") {
      value.experience_years = parseInt(value.experience_years);
      if (isNaN(value.experience_years)) {
        //prettier-ignore
        return res.status(400).json({ message: "Experience years must be a number" });
      }
    }

    const { error } = createScoutSchema.validate(value);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    //prettier-ignore
    const phoneExists = await checkFieldExists(scoutModel.findScoutBy, "phone", value.phone);
    //prettier-ignore
    if (phoneExists) {
          return res.status(403).json({message: 'Phone already in use. please try another phone.'})
        }

    if (!checkUserRole(res, req.user, "scout", "register scout")) return;

    //prettier-ignore
    if( await checkFieldExists(scoutModel.findScoutBy, "user_id", user_id)) {
      //prettier-ignore
      return res.status(400).json({ message: 'A scout profile already exists for this user.' });
    }

    const newScout = await scoutModel.createScout({ user_id, ...value });

    if (!newScout.success || !newScout.data) {
      return res.status(500).json({
        message: "Failed to create scout profile.",
        error: newScout.error,
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
    const user_id = req.user.id;
    let field, newValue;

    if (req.file) {
      field = "image";
      newValue = getImagePath(req.file);
    } else {
      field = req.body.field;
      newValue = req.body.value;

      if (!field) {
        return res.status(400).json({ message: "Field is required." });
      }

      //prettier-ignore
      if (field === "experience_years") {
        newValue = parseInt(newValue);
        if (isNaN(newValue)) {
          return res.status(400).json({ message: "Experience years must be a number" });
        }
      } else if (field !== "image") {
        //prettier-ignore
        return res.status(400).json({ message: `Invalid field: ${field}. Must be one of: image, experience years` });
      }
    }
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
