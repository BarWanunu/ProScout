const { createScoutSchema } = require("../validations/scoutValidation");
const userModel = require("../models/userModel");
const scoutModel = require("../models/scoutModel");

exports.registerScout = async (req, res) => {
  const { error } = createScoutSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // prettier-ignore
  const {username, first_name, last_name, phone, nationality, experience_years, image,} = req.body;

  try {
    const user = await userModel.findUserBy("username", username);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const user_id = user.id;

    const exsitingScout = await scoutModel.findScoutBy("user_id", user_id);

    if (exsitingScout) {
      return res.status(409).json({ message: "User already exists." });
    }
    const exsitingPhone = await scoutModel.findScoutBy("phone", phone);

    if (exsitingPhone) {
      return res.status(409).json({ message: "Phone numebr akready in use." });
    }

    // prettier-ignore
    const newScout = await scoutModel.createScout({user_id, first_name, last_name, phone, nationality, experience_years, image,});
    res
      .status(201)
      .json({ message: "Scout created successfully", scout: newScout });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
