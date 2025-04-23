const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { createUserSchema } = require("../validations/userValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateRequest } = require("../utils/validationUtils");

exports.signupUser = async (req, res) => {
  const value = validateRequest(createUserSchema, req, res);
  if (!value) return;

  const { email, username, password, role } = value;

  try {
    if (await checkFieldExists(res, userModel.findUserBy, "email", email))
      return;
    if (await checkFieldExists(res, userModel.findUserBy, "username", username))
      return;

    // prettier-ignore
    const newUser = await userModel.createUser({
      email,username,password,role,});

    const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_SECRET);

    res
      .status(201)
      .json({ message: "User created successfully.", user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: " Server error", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedUser = await userModel.deleteUserById(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User deleted successfully.",
      user: deletedUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
