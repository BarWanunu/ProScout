const cors = require("cors");
const express = require("express");
const login = require("../routes/login");
const user = require("../routes/user");
const team = require("../routes/team");
const scout = require("../routes/scout");
const player = require("../routes/player");
const shortlist = require("../routes/shortlist");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/login", login);
  app.use("/api/user", user);
  app.use("/api/team", team);
  app.use("/api/scout", scout);
  app.use("/api/player", player);
  app.use("/api/shortlist", shortlist);
};
