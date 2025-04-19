const Joi = require("joi");

const registerTeamSchema = Joi.object({
  username: Joi.string().trim().required(),
  team_name: Joi.string().trim().required(),
  league: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  formation: Joi.string().trim().required(),
  stadium: Joi.string().trim().required(),
  trophies: Joi.number().integer().min(0).optional().default(0),
  logo: Joi.string().optional().default(null),
});

module.exports = {
  registerTeamSchema,
};
