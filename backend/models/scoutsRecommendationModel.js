const db = require("../startup/db");

exports.createRecommendation = async (
  scout_id,
  player_id,
  teams_id,
  recommendation_note
) => {
  const query = `
    INSERT INTO scouts_recommendation (scout_id, player_id, teams_id, recommendation_note)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

  const values = [scout_id, player_id, teams_id, recommendation_note];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.deleteRecommendation = async (id, sender_id) => {
  const query = `
    DELETE FROM scouts_recommendation
    WHERE id = $1 AND (scout_id = $2 OR teams_id = $2)
    RETURNING *;
    `;

  const values = [id, sender_id];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.getRecommendationsByPlayerId = async (player_id) => {
  const query = `
    SELECT * FROM scouts_recommendation
    WHERE player_id = $1;
    `;
  const result = await db.query(query, [player_id]);
  return result.rows;
};

exports.getRecommendationsByTeamId = async (team_id) => {
  const query = `
    SELECT * FROM scouts_recommendation
    WHERE teams_id = $1;
    `;
  const result = await db.query(query, [team_id]);
  return result.rows;
};

exports.getRecommendationsByScoutId = async (scout_id) => {
  const query = `
    SELECT * FROM scouts_recommendation
    WHERE scout_id = $1;
    `;
  const result = await db.query(query, [scout_id]);
  return result.rows;
};

exports.checkDuplicateRecommendation = async (player_id, teams_id) => {
  const query = `
    SELECT * FROM scouts_recommendation
    WHERE player_id = $1 AND teams_id = $2
    `;

  const values = [player_id, teams_id];
  const result = await db.query(query, values);
  return result.rows.length > 0;
};

exports.getRecommendationsById = async (id) => {
  const query = `
    SELECT * FROM scouts_recommendation
    WHERE id = $1;
  `;
  const values = [id];
  const result = await db.query(query, values);
  return result.rows[0];
};
