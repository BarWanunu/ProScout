const jwt = require("jsonwebtoken");

exports.generateAuthToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET);
};
