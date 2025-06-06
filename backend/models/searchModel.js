const db = require("../startup/db");

exports.searchPlayersByName = async (name, limit = 30) => {
  try {
    const query = `
        SELECT * FROM players
      WHERE name ILIKE $1
         OR first_name ILIKE $1
         OR last_name ILIKE $1
      ORDER BY name ASC
      LIMIT $2
        `;
    const { rows } = await db.query(query, [`${name}%`, limit]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: `Database search failed: ${err.message}` };
  }
};

exports.searchTeamsByName = async (name, limit = 30) => {
  try {
    const query = `
        SELECT * FROM teams
      WHERE team_name ILIKE $1
      ORDER BY team_name ASC
      LIMIT $2
        `;
    const { rows } = await db.query(query, [`${name}%`, limit]);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: `Database search failed: ${err.message}` };
  }
};

exports.advancedSearchPlayers = async (filters, limit = 20) => {
  try {
    const conditions = [];
    const values = [];
    let index = 1;

    const clean = (v) => (typeof v === "string" ? v.trim() : v);

    if (filters.name) {
      const val = clean(filters.name);
      conditions.push(
        `(name ILIKE $${index} OR first_name ILIKE $${index} OR last_name ILIKE $${index})`
      );
      values.push(`${val}%`);
      index++;
    }

    if (filters.position) {
      conditions.push(`position = $${index}`);
      values.push(clean(filters.position));
      index++;
    }

    if (filters.club) {
      conditions.push(`club ILIKE $${index}`);
      values.push(`%${clean(filters.club)}%`);
      index++;
    }

    if (filters.nationality) {
      conditions.push(`nationality ILIKE $${index}`);
      values.push(`%${clean(filters.nationality)}%`);
      index++;
    }

    if (filters.age) {
      conditions.push(`age = $${index}`);
      values.push(Number(filters.age));
      index++;
    } else {
      if (filters.min_age) {
        conditions.push(`age >= $${index}`);
        values.push(Number(filters.min_age));
        index++;
      }
      if (filters.max_age) {
        conditions.push(`age <= $${index}`);
        values.push(Number(filters.max_age));
        index++;
      }
    }

    if (filters.min_height) {
      conditions.push(
        `CAST(REGEXP_REPLACE(height, '[^0-9]', '', 'g') AS INTEGER) >= $${index}`
      );
      values.push(Number(filters.min_height));
      index++;
    }

    if (filters.max_height) {
      conditions.push(
        `CAST(REGEXP_REPLACE(height, '[^0-9]', '', 'g') AS INTEGER) <= $${index}`
      );
      values.push(Number(filters.max_height));
      index++;
    }

    if (filters.min_weight) {
      conditions.push(
        `CAST(REGEXP_REPLACE(weight, '[^0-9]', '', 'g') AS INTEGER) >= $${index}`
      );
      values.push(Number(filters.min_weight));
      index++;
    }

    if (filters.max_weight) {
      conditions.push(
        `CAST(REGEXP_REPLACE(weight, '[^0-9]', '', 'g') AS INTEGER) <= $${index}`
      );
      values.push(Number(filters.max_weight));
      index++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT * FROM players
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${index}
    `;
    values.push(limit);

    const result = await db.query(query, values);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to search players: ${err.message}`,
    };
  }
};

exports.advancedSearchTeams = async (filters, limit = 20) => {
  try {
    const conditions = [];
    const values = [];
    let index = 1;

    const clean = (v) => (typeof v === "string" ? v.trim() : v);

    if (filters.team_name) {
      conditions.push(`team_name ILIKE $${index}`);
      values.push(`%${clean(filters.team_name)}%`);
      index++;
    }

    if (filters.league) {
      conditions.push(`league ILIKE $${index}`);
      values.push(`%${clean(filters.league)}%`);
      index++;
    }

    if (filters.country) {
      conditions.push(`country ILIKE $${index}`);
      values.push(`%${clean(filters.country)}%`);
      index++;
    }

    if (filters.formation) {
      conditions.push(`formation = $${index}`);
      values.push(clean(filters.formation));
      index++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT * FROM teams
      ${whereClause}
      ORDER BY team_name ASC
      LIMIT $${index}
    `;
    values.push(limit);

    const result = await db.query(query, values);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to search teams: ${err.message}`,
    };
  }
};
