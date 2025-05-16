const userModel = require("../models/userModel");
const { createUserSchema } = require("../validations/userValidation");
const { checkFieldExists } = require("../utils/existsUtils");
const { validateRequest } = require("../utils/validationUtils");
const { generateAuthToken } = require("../utils/token");

exports.signupUser = async (req, res) => {
  try {
    const value = validateRequest(createUserSchema, req, res);
    if (!value) return;

    const { email, username, password, role } = value;

    //prettier-ignore
    if (await checkFieldExists(res, userModel.findUserBy, "email", email))
      return res.status(400).json({message: 'Email already exists. Please use a different email.'});
    //prettier-ignore
    if (await checkFieldExists(res, userModel.findUserBy, "username", username))
      return res.status(400).json({message: 'Username already taken. Please choose a different username.'});

    const newUser = await userModel.createUser({
      email,
      username,
      password,
      role,
    });

    const token = generateAuthToken(newUser);
    //prettier-ignore
    res.status(201).json({ message: "User created successfully.", user: newUser, token });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error occurred during user registration.", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedUser = await userModel.deleteUserById(userId);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User not found. Deletion failed." });
    }

    //prettier-ignore
    res.status(200).json({message: "User deleted successfully.",user: deletedUser,});
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error occurred during user deletion.", error: err.message });
  }
};
