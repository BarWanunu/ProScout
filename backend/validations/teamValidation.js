const Joi = require("joi");
const { validateRequest } = require("../utils/validationUtils");

const registerTeamSchema = Joi.object({
  team_name: Joi.string().trim().max(100).required().messages({
    "any.required": "Team name is required",
    "string.empty": "Team name cannot be empty",
    "string.max": "Team name must be at most 100 characters",
  }),
  league: Joi.string().trim().max(100).required().messages({
    "any.required": "League is required",
    "string.empty": "League cannot be empty",
    "string.max": "League must be at most 100 characters",
  }),
  country: Joi.string().trim().max(50).required().messages({
    "any.required": "Country is required",
    "string.empty": "Country cannot be empty",
    "string.max": "Country must be at most 50 characters",
  }),
  formation: Joi.string().trim().max(25).required().messages({
    "any.required": "Formation is required",
    "string.empty": "Formation cannot be empty",
    "string.max": "Formation must be at most 25 characters",
  }),
  stadium: Joi.string().trim().max(100).required().messages({
    "any.required": "Stadium name is required",
    "string.empty": "Stadium cannot be empty",
    "string.max": "Stadium name must be at most 100 characters",
  }),
  trophies: Joi.number().integer().min(0).optional().default(0).messages({
    "number.base": "Trophies must be a number",
    "number.integer": "Trophies must be an integer",
    "number.min": "Trophies must be 0 or more",
  }),
  logo: Joi.string().trim().allow("").optional().default("").messages({
    "string.base": "Logo must be a string",
  }),
});

const allowedFields = ["formation", "stadium", "trophies", "logo"];

const updateTeamFieldSchema = Joi.object({
  field: Joi.string()
    .valid(...allowedFields)
    .required()
    .messages({
      "any.only": `field must be one of: ${allowedFields.join(", ")}`,
      "any.required": `field is required`,
    }),
  value: Joi.alternatives().conditional("field", [
    { is: "formation", then: registerTeamSchema.extract("formation") },
    { is: "stadium", then: registerTeamSchema.extract("stadium") },
    { is: "trophies", then: registerTeamSchema.extract("trophies") },
    { is: "logo", then: registerTeamSchema.extract("logo") },
  ]),
});

module.exports = {
  registerTeamSchema,
  updateTeamFieldSchema,
};
