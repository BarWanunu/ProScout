const cors = require("cors");
const express = require("express");
const login = require("../routes/login");
const signup = require("../routes/signup");
const team = require("../routes/team");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/login", login);
  app.use("/api/signup", signup);
  app.use("/api/team", team);
};
