const cors = require("cors");
const express = require("express");
const login = require("../routes/login");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/login", login);
};
