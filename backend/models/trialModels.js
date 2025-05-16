const db = require("../startup/db");

exports.createTrial = async (
  player_id,
  team_id,
  scout_id,
  invitation_message,
  trial_date,
  sender_role,
  status = "pending"
) => {
  const query = `
        INSERT INTO trials (player_id, team_id, scout_id, invitation_message, trial_date, sender_role, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
  const values = [
    player_id,
    team_id,
    scout_id || null,
    invitation_message || null,
    trial_date,
    sender_role,
    status,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

exports.updateTrialStatus = async (trial_id, status) => {
  const query = `
        UPDATE trials
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;
  const values = [status, trial_id];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.deleteTrial = async (trial_id) => {
  const query = `
        DELETE FROM trials
        WHERE id = $1
        RETURNING *;
    `;
  const values = [trial_id];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.getTrialById = async (trial_id) => {
  const query = `
        SELECT * FROM trials
        WHERE id = $1;
    `;
  const values = [trial_id];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.getTrialsByPlayerId = async (player_id) => {
  const query = `
        SELECT * FROM trials
        WHERE player_id = $1;
    `;
  const values = [player_id];
  const result = await db.query(query, values);
  return result.rows;
};

exports.getTrialsByTeamId = async (team_id) => {
  const query = `
        SELECT * FROM trials
        WHERE team_id = $1;
    `;
  const values = [team_id];
  const result = await db.query(query, values);
  return result.rows;
};

exports.playerExists = async (player_id) => {
  const query = `
    SELECT id FROM players WHERE id = $1;
  `;
  const values = [player_id];
  const result = await db.query(query, values);
  return result.rows.length > 0;
};

exports.teamExists = async (team_id) => {
  const query = `
    SELECT id FROM teams WHERE id = $1;
  `;
  const values = [team_id];
  const result = await db.query(query, values);
  return result.rows.length > 0;
};
