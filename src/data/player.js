import fetch from "node-fetch";
import fs from "fs";
const API_KEY = "13bfe36622339b25026ac3582161b87e";

async function fetchPlayerStats(playerIds) {
  for (const id of playerIds) {
    const allSeasonStats = [];
    let playerName = "unknown";

    for (let season = 2020; season <= 2024; season++) {
      try {
        const response = await fetch(
          `https://v3.football.api-sports.io/players?id=${id}&season=${season}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_KEY,
            },
          }
        );

        const data = await response.json();
        const player = data?.response?.[0]?.player;
        const stats = data?.response?.[0]?.statistics;
        if (!player || !stats) continue;

        if (playerName === "unknown") {
          playerName = player.name.replace(/\s+/g, "_").toLowerCase(); // normalize file name
        }

        const teamName = stats[0]?.team?.name || "Unknown";

        let totals = {
          season: season,
          club: teamName,
          goals: 0,
          assists: 0,
          yellow_cards: 0,
          red_cards: 0,
          passes_completed: 0,
          key_passes: 0,
          shots_on_target: 0,
          dribbles_attempted: 0,
          dribbles_success: 0,
          dribble_success_rate: 0,
          tackles: 0,
          interceptions: 0,
          duels: 0,
          duels_won: 0,
          rating: 0,
        };

        let ratingSum = 0;
        let ratingCount = 0;

        for (const stat of stats) {
          totals.goals += stat.goals?.total ?? 0;
          totals.assists += stat.goals?.assists ?? 0;
          totals.yellow_cards += stat.cards?.yellow ?? 0;
          totals.red_cards += stat.cards?.red ?? 0;
          totals.passes_completed += stat.passes?.total ?? 0;
          totals.key_passes += stat.passes?.key ?? 0;
          totals.shots_on_target += stat.shots?.on ?? 0;
          totals.dribbles_attempted += stat.dribbles?.attempts ?? 0;
          totals.dribbles_success += stat.dribbles?.success ?? 0;
          totals.tackles += stat.tackles?.total ?? 0;
          totals.interceptions += stat.tackles?.interceptions ?? 0;
          totals.duels += stat.duels?.total ?? 0;
          totals.duels_won += stat.duels?.won ?? 0;

          const rating = parseFloat(stat.games?.rating);
          if (!isNaN(rating)) {
            ratingSum += rating;
            ratingCount++;
          }
        }

        totals.rating =
          ratingCount > 0
            ? parseFloat((ratingSum / ratingCount).toFixed(2))
            : 0;
        totals.dribble_success_rate =
          totals.dribbles_attempted > 0
            ? parseFloat(
                (
                  (totals.dribbles_success / totals.dribbles_attempted) *
                  100
                ).toFixed(2)
              ) + "%"
            : 0;

        allSeasonStats.push(totals);
      } catch (err) {
        console.error(`❌ Error for player ${id} in season ${season}:`, err);
      }
    }

    // Final object and file write
    const output = {
      player_id: id,
      name: playerName.replace(/_/g, " "), // for human-readable output
      stats: allSeasonStats,
    };

    const outputPath = `player_stats.json`;
    let existingData = [];
    if (fs.existsSync(outputPath)) {
      const fileContent = fs.readFileSync(outputPath, "utf-8");
      try {
        const parsed = JSON.parse(fileContent);
        // Make sure it's an array, even if the file had a single object
        existingData = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error("❌ Failed to parse existing JSON. Overwriting.");
        existingData = [];
      }
    }
    existingData.push(output); // Add the new player's data
    fs.writeFileSync(
      outputPath,
      JSON.stringify(existingData, null, 2),
      "utf-8"
    );
    console.log(`✅ Stats saved to ${outputPath}`);
  }
}

// Example: Run for multiple players
fetchPlayerStats([
  1590, 19341, 19143, 82855, 18742, 21138, 135334, 135068, 195717, 19147, 130,
  41606, 388777, 303322, 449245, 283272, 408893, 3080, 157912, 265784, 195103,
  144732, 2056, 20665, 401098, 2032, 1165, 24888, 7722, 282770, 282126, 925,
  385726, 380653, 456206, 389302, 303019,
]);
