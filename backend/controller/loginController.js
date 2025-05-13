const { generateAuthToken } = require("../utils/token");
const { fetchUserProfile } = require("../utils/fetchUserProfile");
const userModel = require("../models/userModel");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserBy("email", email);
    const passwordCheck =
      user && userModel.checkPassword(password, user.password);
    if (!user || !passwordCheck) {
      return res
        .status(401)
        .json({ message: "Email or Password are invalid." });
    }

    try {
      const profile = await fetchUserProfile(user);

      if (!profile) {
        return res.status(403).json({
          message: `User must complete ${user.role} profile before logging in.`,
        });
      }

      const token = generateAuthToken(user);

      res.json({
        message: "Login Successful.",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.username,
        },
        token,
      });
    } catch (err) {
      return res.status(403).json({
        message: `User must complete ${user.role} profile before logging in.`,
        error: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
