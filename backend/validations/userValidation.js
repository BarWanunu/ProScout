const Joi = require("joi");

const createUserSchema = Joi.object({
  email: Joi.string().email().max(255).required().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
    "string.max": "Email must be at most 255 characters",
  }),
  username: Joi.string().trim().min(3).max(100).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
    "string.max": "Username must be at most 100 characters",
    "string.min": "Username must be at least 3 characters",
  }),
  password: Joi.string().min(8).max(255).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 255 characters",
  }),
  role: Joi.string().valid("scout", "player", "team").required().messages({
    "any.required": "Role is required",
    "any.only": "Role must be one of: scout, player, or team",
    "string.empty": "Role cannot be empty",
  }),
});

module.exports = {
  createUserSchema,
};
