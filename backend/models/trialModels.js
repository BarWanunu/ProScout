const db = require("../startup/db");

//prettier-ignore
exports.createTrial = async (player_id,team_id,scout_id,invitation_message,trial_date,sender_role,status = "pending") => {
  try {
    const query = `
      INSERT INTO trials (player_id, team_id, scout_id, invitation_message, trial_date, sender_role, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    //prettier-ignore
    const values = [player_id,team_id,scout_id || null,invitation_message || null,trial_date,sender_role,status,];

    const result = await db.query(query, values);
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to create trial: ${err.message}` };
  }
};

exports.updateTrialStatus = async (trial_id, status) => {
  try {
    const query = `
      UPDATE trials
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, trial_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return {
      success: false,
      error: `Failed to update trial status: ${err.message}`,
    };
  }
};

exports.deleteTrial = async (trial_id) => {
  try {
    const query = `
      DELETE FROM trials
      WHERE id = $1
      RETURNING *;
    `;
    const values = [trial_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows[0] };
  } catch (err) {
    return { success: false, error: `Failed to delete trial: ${err.message}` };
  }
};

exports.getTrialById = async (trial_id) => {
  try {
    const query = `
      SELECT * FROM trials
      WHERE id = $1;
    `;
    const values = [trial_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows[0] || null };
  } catch (err) {
    return {
      success: false,
      error: `Failed to get trial by ID: ${err.message}`,
    };
  }
};

exports.getTrialsByPlayerId = async (player_id) => {
  try {
    const query = `
      SELECT * FROM trials
      WHERE player_id = $1;
    `;
    const values = [player_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to get trials by player ID: ${err.message}`,
    };
  }
};

exports.getTrialsByScoutId = async (scout_id) => {
  try {
    const query = `
      SELECT * FROM trials
      WHERE scout_id = $1;
    `;
    const values = [scout_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to get trials by scout ID: ${err.message}`,
    };
  }
};
exports.getTrialsByTeamId = async (team_id) => {
  try {
    const query = `
      SELECT * FROM trials
      WHERE team_id = $1;
    `;
    const values = [team_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to get trials by team ID: ${err.message}`,
    };
  }
};

exports.playerExists = async (player_id) => {
  try {
    const query = `
      SELECT id FROM players WHERE id = $1;
    `;
    const values = [player_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows.length > 0 };
  } catch (err) {
    return {
      success: false,
      error: `Failed to check player existence: ${err.message}`,
    };
  }
};

exports.scoutExists = async (scout_id) => {
  try {
    const query = `
      SELECT id FROM scouts WHERE id = $1;
    `;
    const values = [scout_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows.length > 0 };
  } catch (err) {
    return {
      success: false,
      error: `Failed to check scout existence: ${err.message}`,
    };
  }
};
exports.teamExists = async (team_id) => {
  try {
    const query = `
      SELECT id FROM teams WHERE id = $1;
    `;
    const values = [team_id];
    const result = await db.query(query, values);
    return { success: true, data: result.rows.length > 0 };
  } catch (err) {
    return {
      success: false,
      error: `Failed to check team existence: ${err.message}`,
    };
  }
};
