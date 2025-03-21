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
          club: "Wolves",
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
  1590, 19341, 19143, 82855, 18742, 21138, 135334, 135068, 195717, 19147, 130,
  41606, 388777, 303322, 449245, 283272, 408893, 3080, 157912, 265784, 195103,
  144732, 2056, 20665, 401098, 2032, 1165, 24888, 7722, 282770, 282126, 925,
  385726, 380653, 456206, 389302, 303019,
]);
