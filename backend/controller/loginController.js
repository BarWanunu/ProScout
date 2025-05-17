const { generateAuthToken } = require("../utils/token");
const { fetchUserProfile } = require("../utils/fetchUserProfile");
const userModel = require("../models/userModel");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserBy("email", email);

    if (!user.success) {
      return res.status(500).json({
        message: "Internal server error during user lookup.",
        error: user.error,
      });
    }

    const userData = user.data;

    //prettier-ignore
    const passwordCheck = userData && userModel.checkPassword(password, userData.password);
    //prettier-ignore
    if (!userData || !passwordCheck) {
      return res.status(401).json({ message: "Email or Password are invalid. Please try again." });
    }

    try {
      const profile = await fetchUserProfile(userData);

      if (!profile) {
        return res.status(403).json({
          message: `User must complete ${userData.role} profile before logging in.`,
        });
      }

      const token = generateAuthToken(userData);

      res.status(200).json({
        message: "Login Successful.",
        user: userData,
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
