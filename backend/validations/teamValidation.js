const Joi = require("joi");

const registerTeamSchema = Joi.object({
  username: Joi.string().trim().max(100).required(),
  team_name: Joi.string().trim().max(100).required(),
  league: Joi.string().trim().max(100).required(),
  country: Joi.string().trim().max(50).required(),
  formation: Joi.string().trim().max(25).required(),
  stadium: Joi.string().trim().max(100).required(),
  trophies: Joi.number().integer().min(0).optional().default(0),
  logo: Joi.string().optional().default(null),
});

module.exports = {
  registerTeamSchema,
};
