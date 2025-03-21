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
          club: "Villarreal",
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
  278619, 122956, 169256, 302277, 21997, 314, 885, 288112, 166, 18794, 70500,
  1702, 435552, 161931, 336637, 484474, 1461, 51016, 928, 47541, 182219, 20696,
  184226, 391131, 463280, 307565, 1707, 290740, 343684, 3246, 18906, 378284,
]);
