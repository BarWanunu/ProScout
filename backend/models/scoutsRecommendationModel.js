const db = require("../startup/db");

//prettier-ignore
exports.createRecommendation = async (scout_id, player_id, teams_id, recommendation_note) => {
  try {
    const query = `
      INSERT INTO scouts_recommendation (scout_id, player_id, teams_id, recommendation_note)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [scout_id, player_id, teams_id, recommendation_note];
    const result = await db.query(query, values);
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to create recommendation: ${err.message}` };
  }
};

exports.deleteRecommendation = async (id, sender_id) => {
  try {
    const query = `
      DELETE FROM scouts_recommendation
      WHERE id = $1 AND (scout_id = $2 OR teams_id = $2)
      RETURNING *;
    `;
    const values = [id, sender_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return {
      success: false,
      error: `Failed to delete recommendation: ${err.message}`,
    };
  }
};

exports.getRecommendationsByPlayerId = async (player_id) => {
  try {
    const query = `SELECT * FROM scouts_recommendation WHERE player_id = $1;`;
    const result = await db.query(query, [player_id]);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Error fetching recommendations by player ID: ${err.message}`,
    };
  }
};

exports.getRecommendationsByTeamId = async (team_id) => {
  try {
    const query = `SELECT * FROM scouts_recommendation WHERE teams_id = $1;`;
    const result = await db.query(query, [team_id]);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Error fetching recommendations by team ID: ${err.message}`,
    };
  }
};

exports.getRecommendationsByScoutId = async (scout_id) => {
  try {
    const query = `SELECT * FROM scouts_recommendation WHERE scout_id = $1;`;
    const result = await db.query(query, [scout_id]);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Error fetching recommendations by scout ID: ${err.message}`,
    };
  }
};

exports.checkDuplicateRecommendation = async (player_id, teams_id) => {
  try {
    const query = `
      SELECT * FROM scouts_recommendation
      WHERE player_id = $1 AND teams_id = $2
    `;
    const values = [player_id, teams_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows.length > 0 };
  } catch (err) {
    return {
      success: false,
      error: `Error checking duplicate recommendation: ${err.message}`,
    };
  }
};

exports.getRecommendationsById = async (id) => {
  try {
    const query = `SELECT * FROM scouts_recommendation WHERE id = $1;`;
    const result = await db.query(query, [id]);
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return {
      success: false,
      error: `Error fetching recommendation by ID: ${err.message}`,
    };
  }
};
