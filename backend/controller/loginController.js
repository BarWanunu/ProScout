const { generateAuthToken } = require("../utils/token");
const { fetchUserProfile } = require("../utils/fetchUserProfile");
const userModel = require("../models/userModel");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserBy("email", email);

    //prettier-ignore
    const passwordCheck = user && userModel.checkPassword(password, user.password);
    //prettier-ignore
    if (!user || !passwordCheck) {
      return res.status(401).json({ message: "Email or Password are invalid. Please try again." });
    }

    try {
      const profile = await fetchUserProfile(user);

      if (!profile) {
        return res.status(403).json({
          message: `User must complete ${user.role} profile before logging in.`,
        });
      }

      const token = generateAuthToken(user);

      res.status(200).json({
        message: "Login Successful.",
        user: user,
        token,
      });
    } catch (err) {
      return res.status(403).json({
        message: "Error while fetching profile. Please try again later.",
        error: err.message,
      });
    }
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Internal server error during login.", error: err.message });
  }
};
