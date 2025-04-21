const Joi = require("joi");

const createPlayerSchema = Joi.object({
  username: Joi.string().trim().max(100).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
    "string.max": "Username must be at most 100 characters",
  }),
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Player name is required",
    "string.max": "Player name must be at most 100 characters",
  }),

  first_name: Joi.string().trim().max(100).required().messages({
    "string.empty": "First name is required",
    "string.max": "First name must be at most 100 characters",
  }),
  last_name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Last name is required",
    "string.max": "Last name must be at most 100 characters",
  }),
  age: Joi.number().integer().min(0).max(100).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age cannot be negative",
    "number.max": "Age seems too high",
    "any.required": "Age is required",
  }),
  club: Joi.string().trim().max(100).empty("").default("Free Agent").messages({
    "string.max": "Club must be at most 100 characters",
  }),
  number: Joi.number().integer().min(0).max(99).required().messages({
    "number.base": "Number must be a number",
    "number.min": "Number cannot be negative",
    "number.max": "Number must be at most 99",
    "any.required": "Jersey number is required",
  }),
  photo: Joi.string().trim().allow("").optional().default("").messages({
    "string.base": "Image must be a string",
  }),
  // prettier-ignore
  position: Joi.string()
    .valid("Goalkeeper", "Defender", "Midfielder", "Attacker").required().messages({
      "any.only": "Position must be one of Goalkeeper, Defender, Midfielder, or Attacker",
      "any.required": "Position is required",
    }),
  // prettier-ignore
  height: Joi.string().pattern(/^\d+\s?cm$/).required().messages({
      "string.pattern.base":"Height must be a number followed by 'cm', e.g., '180cm'",
      "string.empty": "Height is required",
    }),
  // prettier-ignore
  weight: Joi.string().pattern(/^\d+\s?kg$/).required().messages({
      "string.pattern.base": "Weight must be a number followed by 'kg', e.g., '75kg'",
      "string.empty": "Weight is required",
    }),
  nationality: Joi.string().trim().max(100).required().messages({
    "string.empty": "Nationality is required",
    "string.max": "Nationality must be at most 100 characters",
  }),

  birthdate: Joi.date().required().messages({
    "date.base": "Birthdate must be a valid date",
    "any.required": "Birthdate is required",
  }),
  video: Joi.string().trim().optional().allow("").messages({
    "string.base": "Video must be a string",
  }),
});

module.exports = { createPlayerSchema };
