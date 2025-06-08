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

exports.searchPlayersWithStats = async (filters, limit = 30) => {
  try {
    const conditions = [];
    const values = [];
    let index = 1;

    const clean = (v) => (typeof v === "string" ? v.trim() : v);

    if (filters.name) {
      conditions.push(
        `(p.name ILIKE $${index} OR p.first_name ILIKE $${index} OR p.last_name ILIKE $${index})`
      );
      values.push(`${clean(filters.name)}%`);
      index++;
    }

    if (filters.club) {
      conditions.push(`p.club ILIKE $${index}`);
      values.push(`%${clean(filters.club)}%`);
      index++;
    }

    if (filters.season) {
      conditions.push(`s.season = $${index}`);
      values.push(Number(filters.season));
      index++;
    }

    if (filters.position) {
      conditions.push(`p.position = $${index}`);
      values.push(clean(filters.position));
      index++;
    }

    const statFields = [
      "goals",
      "assists",
      "yellow_cards",
      "red_cards",
      "passes_completed",
      "key_passes",
      "shots_on_target",
      "dribbles_attempted",
      "dribbles_success",
      "dribble_success_rate",
      "tackles",
      "interceptions",
      "duels",
      "duels_won",
      "rating",
    ];

    const orderByFields = [];

    for (const field of statFields) {
      const key = `min_${field}`;
      if (filters[key] !== undefined) {
        conditions.push(`s.${field} >= $${index}`);
        values.push(Number(filters[key]));
        index++;

        orderByFields.push(`s.${field} DESC`);
      }
    }

    if (orderByFields.length === 0) {
      orderByFields.push("p.name ASC");
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderByClause = `ORDER BY ${orderByFields.join(", ")}`;

    const query = `
      SELECT p.id, p.name, p.club, s.*
      FROM players p
      JOIN player_stats s ON p.id = s.player_id
      ${whereClause}
      ${orderByClause}
      LIMIT $${index}
    `;

    values.push(limit);

    const result = await db.query(query, values);
    return { success: true, data: result.rows };
  } catch (err) {
    return {
      success: false,
      error: `Failed to search players with stats: ${err.message}`,
    };
  }
};
