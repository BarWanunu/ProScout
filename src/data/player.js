import fetch from "node-fetch";
import fs from "fs";
const API_KEY = "13bfe36622339b25026ac3582161b87e";

async function fetchPlayerProfiles(playerIds) {
  const allPlayers = [];

  for (const id of playerIds) {
    try {
      const response = await fetch(
        `https://v3.football.api-sports.io/players/profiles?player=${id}`,
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

      if (player) {
        allPlayers.push({
          user_id: "------------",
          id: player.id,
          name: player.name,
          firstname: player.firstname,
          lastname: player.lastname,
          number: player.number || "N/A",
          club: "Wolfsburg",
          photo: player.photo,
          position: player.position,
          height: player.height || "Unknown",
          weight: player.weight || "Unknown",
          nationality: player.nationality,
          birthdate: player.birth?.date || "Unknown",
          video: "-----------",
        });
      } else {
        console.warn(`No data for player ID: ${id}`);
      }
    } catch (err) {
      console.error(`Error fetching player ID ${id}:`, err);
    }
  }

  // Print final JSON
  const outputPath = "./playersData.json"; // File will be saved here
  fs.writeFileSync(outputPath, JSON.stringify(allPlayers, null, 2), "utf-8");
  console.log(`✅ Player data saved to ${outputPath}`);
}

// Your full list of player IDs
fetchPlayerProfiles([
  15573, 25396, 1141, 129133, 177618, 1408, 162409, 15745, 30527, 1291, 1930,
  449714, 394740, 435086, 127413, 40560, 1321, 380503, 25408, 25400, 30484,
  431946, 126642, 149557, 15916, 200139, 19461, 265363, 148284, 25192, 1302,
  431914,
]);
