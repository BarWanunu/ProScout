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
    const emailExists = await checkFieldExists(userModel.findUserBy, "email", email);
    //prettier-ignore
    if (emailExists) {
      return res.status(403).json({message: 'Email already in use. please try another email.'})
    }
    //prettier-ignore
    const usernameExists = await checkFieldExists(userModel.findUserBy, "username", username);
    //prettier-ignore
    if (usernameExists) {
      return res.status(403).json({message: 'Username already in use. please try another username.'})
      
    }

    //prettier-ignore
    const newUser = await userModel.createUser({email,username,password,role,});

    if (!newUser.success) {
      return res.status(500).json({
        message: "Internal server error occurred during user registration.",
      });
    }

    const token = generateAuthToken(newUser.data);

    //prettier-ignore
    res.status(201).json({ message: "User created successfully.", user: newUser.data, token });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error occurred during user registration.", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedUser = await userModel.deleteUserById(userId);
    if (!deletedUser.success) {
      //prettier-ignore
      return res.status(404).json({ message: "User not found. Deletion failed." });
    }

    //prettier-ignore
    res.status(200).json({message: "User deleted successfully.",user: deletedUser.data});
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error occurred during user deletion.", error: err.message });
  }
};
