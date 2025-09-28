require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const db = require('./db'); 

// These are the features used for cosine similarity
const SIMILARITY_FEATURES = [
    'Pos', 'Age', 'Int', 'Clr', 'KP', 'PPA', 'CrsPA', 'PrgP', 'Playing Time MP',
    'Performance Gls', 'Performance Ast', 'Performance G+A', 'Performance G-PK',
    'Performance Fls', 'Performance Fld', 'Performance Crs', 'Performance Recov',
    'Expected xG', 'Expected npxG', 'Expected xAG', 'Expected xA', 'Expected A-xAG',
    'Expected G-xG', 'Expected np:G-xG', 'Progression PrgC', 'Progression PrgP',
    'Progression PrgR', 'Tackles Tkl', 'Tackles TklW', 'Tackles Def 3rd',
    'Tackles Mid 3rd', 'Tackles Att 3rd', 'Challenges Att', 'Challenges Tkl%',
    'Challenges Lost', 'Blocks Blocks', 'Blocks Sh', 'Blocks Pass', 'Standard Sh',
    'Standard SoT', 'Standard SoT%', 'Standard Sh/90', 'Standard Dist', 'Standard FK',
    'Performance GA', 'Performance SoTA', 'Performance Saves', 'Performance Save%',
    'Performance CS', 'Performance CS%', 'Penalty Kicks PKatt', 'Penalty Kicks Save%',
    'SCA SCA', 'GCA GCA', 'Aerial Duels Won', 'Aerial Duels Lost', 'Aerial Duels Won%',
    'Total Cmp', 'Total Att', 'Total Cmp%', 'Total TotDist', 'Total PrgDist', '1/3'
];

// Mapping for the 'Pos' column to convert it to a numeric value
const positionMapping = {
    'GK': 1, 'DF': 2, 'DF,MF': 3, 'DF,FW': 4, 'MF,DF': 5, 'MF': 6,
    'FW,DF': 7, 'MF,FW': 8, 'FW,MF': 9, 'FW': 10
};

// Helper to convert CSV headers to snake_case for DB columns
const toSnakeCase = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
              .replace(/[\s-]/g, '_')
              .replace(/__/g, '_')
              .replace(/%/g, 'pct')
              .replace(/\//g, '_per_')
              .replace(/1_3/g, 'final_third')
              .replace(/^\_/, '');
};

// Min-Max Scaler implementation in JS
function minMaxScale(data) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    if (max === min) return data.map(() => 0);
    return data.map(val => (val - min) / (max - min));
}

async function setupPlayerStatsTable() {
    console.log('Setting up proscout_player_stats table...');
    // Updated path: CSV moved to backend/data
    const csvPath = path.join(__dirname, '..', 'data', 'football-player-stats.csv');
    const fileContent = fs.readFileSync(csvPath);
    let records = parse(fileContent, { columns: true, skip_empty_lines: true, cast: true });

    // --- Create Table ---
    const headers = Object.keys(records[0]);
    let createTableQuery = 'CREATE TABLE IF NOT EXISTS proscout_player_stats (\n';
    headers.forEach(header => {
        const columnName = toSnakeCase(header);
        let columnType = 'VARCHAR(255)';
        if (typeof records[0][header] === 'number') {
            // Treat all numbers as FLOAT to prevent type errors with decimals.
            columnType = 'FLOAT';
        }
        createTableQuery += `  "${columnName}" ${columnType},\n`;
    });
    createTableQuery += '  embedding FLOAT[]\n);';

    await db.query('DROP TABLE IF EXISTS proscout_player_stats;');
    await db.query(createTableQuery);

    // --- Normalize data and create embeddings ---
    records.forEach(rec => { rec.Pos = positionMapping[rec.Pos] || 0; });

    const featuresData = {};
    SIMILARITY_FEATURES.forEach(feature => {
        featuresData[feature] = records.map(rec => rec[feature] || 0);
    });

    const scaledFeatures = {};
    for (const feature in featuresData) {
        scaledFeatures[feature] = minMaxScale(featuresData[feature]);
    }

    records.forEach((rec, index) => {
        rec.embedding = SIMILARITY_FEATURES.map(feature => scaledFeatures[feature][index]);
    });

    // --- Insert Data ---
    console.log(`Inserting ${records.length} records...`);
    for (const record of records) {
        const columns = Object.keys(record).map(h => `"${toSnakeCase(h)}"`).join(', ');
        const values = Object.values(record);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO proscout_player_stats (${columns}) VALUES (${placeholders})`;
        await db.query(query, values);
    }
    console.log('Database setup finished successfully!');
}

if (require.main === module) {
    setupPlayerStatsTable().catch(console.error);
}