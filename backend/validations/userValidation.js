const Joi = require("joi");

const createUserSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  username: Joi.string().trim().max(100).required(),
  password: Joi.string().min(8).max(255).required(),
  role: Joi.string().valid("scout", "player", "team").required(),
});

module.exports = {
  createUserSchema,
};
