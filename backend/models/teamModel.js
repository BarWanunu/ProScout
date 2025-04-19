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

exports.findTeamByUserIdOrName = async (user_id, team_name) => {
  const result = await db.query(
    `SELECT * FROM teams WHERE user_id = $1 OR team_name = $2`,
    [user_id, team_name]
  );
  return result.rows[0];
};
