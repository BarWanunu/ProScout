const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const teamModel = require("../models/teamModel");
const scoutModel = require("../models/scoutModel");
const playerModel = require("../models/playerModel");

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

    let roleExists = false;
    if (user.role === "player") {
      roleExists = await playerModel.findPlayerBy("user_id", user.id);
    } else if (user.role === "scout") {
      roleExists = await scoutModel.findScoutBy("user_id", user.id);
    } else if (user.role === "team") {
      roleExists = await teamModel.findTeamBy("user_id", user.id);
    }

    if (!roleExists) {
      return res.status(403).json({
        message: `User must complete ${user.role} profile before logging in.`,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
