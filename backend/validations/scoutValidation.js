const Joi = require("joi");

const createScoutSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),

  first_name: Joi.string().trim().max(100).required().messages({
    "string.empty": "First name is required",
    "string.max": "First name must be at most 100 characters",
    "any.required": "First name is required",
  }),

  last_name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Last name is required",
    "string.max": "Last name must be at most 100 characters",
    "any.required": "Last name is required",
  }),

  phone: Joi.string()
    .pattern(/^05\d-\d{7}$/)
    .max(20)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone must be in format 05X-XXXXXXX",
      "string.max": "Phone number must be at most 20 characters",
      "any.required": "Phone number is required",
    }),

  nationality: Joi.string().trim().max(100).required().messages({
    "string.empty": "Nationality is required",
    "string.max": "Nationality must be at most 100 characters",
    "any.required": "Nationality is required",
  }),

  image: Joi.string().trim().default("").messages({
    "string.base": "Image must be a string",
  }),

  experience_years: Joi.number()
    .min(0)
    .max(100)
    .required()
    .default(0)
    .messages({
      "number.base": "Experience years must be a number",
      "number.min": "Experience years must be at least 0",
      "number.max": "Experience years cannot be more than 100",
      "any.required": "Experience years is required",
    }),
});

module.exports = { createScoutSchema };
