const userModel = require("../models/userModel");

exports.getUser = async (username, res) => {
  const user = await userModel.findUserBy("username", username);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }
  return user;
};
