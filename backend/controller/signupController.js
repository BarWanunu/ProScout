const userModel = require("../models/userModel");

exports.signupUser = async (req, res) => {
  const { email, username, password, role } = req.body;

  const allowedRoles = ["scout", "player", "team"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid Role" });
  }

  try {
    const existingEmail = await userModel.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const exisitingUsername = await userModel.findUserByUsername(username);
    if (exisitingUsername) {
      return res.status(409).json({ message: "username already in use" });
    }

    const newUser = await userModel.createUser({
      email,
      username,
      password,
      role,
    });
    res
      .status(201)
      .json({ message: "User Created Successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: " Server error", error: err.message });
  }
};
