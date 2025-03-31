import fs from "fs";
import path from "path";
import { parse } from "json2csv";

const statsFolder = "./Stats";
const outputPath = "./player_stats.csv";

let allRows = [];

try {
  const files = fs.readdirSync(statsFolder);

  for (const file of files) {
    const fullPath = path.join(statsFolder, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    let parsedJson;
    try {
      parsedJson = JSON.parse(content);
    } catch (err) {
      console.error(`❌ שגיאה בקריאת הקובץ ${file}:`, err.message);
      continue;
    }

    // נוודא שמדובר או ברשימה של שחקנים או בשחקן יחיד
    const players = Array.isArray(parsedJson) ? parsedJson : [parsedJson];

    for (const player of players) {
      if (!Array.isArray(player.stats)) continue;

      for (const stat of player.stats) {
        allRows.push({
          player_id: player.player_id,
          name: player.name,
          season: stat.season,
          club: stat.club,
          goals: stat.goals,
          assists: stat.assists,
          yellow_cards: stat.yellow_cards,
          red_cards: stat.red_cards,
          passes_completed: stat.passes_completed,
          key_passes: stat.key_passes,
          shots_on_target: stat.shots_on_target,
          dribbles_attempted: stat.dribbles_attempted,
          dribbles_success: stat.dribbles_success,
          dribble_success_rate: stat.dribble_success_rate,
          tackles: stat.tackles,
          interceptions: stat.interceptions,
          duels: stat.duels,
          duels_won: stat.duels_won,
          rating: stat.rating,
        });
      }
    }
  }

  if (allRows.length > 0) {
    const csv = parse(allRows);
    fs.writeFileSync(outputPath, csv, "utf-8");
    console.log(`✅ הקובץ נוצר בהצלחה: ${outputPath}`);
  } else {
    console.log("⚠️ לא נמצאו נתונים.");
  }
} catch (error) {
  console.error("❌ שגיאה כללית:", error.message);
}
