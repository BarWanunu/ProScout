const userModel = require("../models/userModel");

exports.getUser = async (username, res) => {
  const user = await userModel.findUserBy("username", username);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }
  return user;
};
exports.getUserById = async (id, res) => {
  const user = await userModel.findUserBy("id", id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }
  return user;
};
