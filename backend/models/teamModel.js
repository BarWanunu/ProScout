const db = require("../startup/db");

exports.createTeam = async (team) => {
  const {
    user_id,
    team_name,
    league,
    country,
    formation,
    stadium,
    trophies,
    logo,
  } = team;

  const result = await db.query(
    `INSERT INTO teams 
     (user_id, team_name, league, country, formation, stadium, trophies, logo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, user_id, team_name, created_at`,
    [
      user_id,
      team_name,
      league,
      country,
      formation,
      stadium,
      trophies,
      logo || null,
    ]
  );

  return result.rows[0];
};

exports.findTeamBy = async (field, value) => {
  const allowedFields = ["user_id", "team_name"];
  if (!allowedFields.includes(field)) {
    throw new Error("Invalid field for team lookup");
  }

  const query = `SELECT * FROM teams WHERE ${field} = $1`;
  const result = await db.query(query, [value]);
  return result.rows[0];
};
