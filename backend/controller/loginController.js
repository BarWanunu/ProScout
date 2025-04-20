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

    res.json({
      message: "Login Successful.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
