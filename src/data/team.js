import fetch from "node-fetch";
import fs from "fs";
const API_KEY = "13bfe36622339b25026ac3582161b87e";

async function fetchPlayerStats(playerIds) {
  const results = [];
  const club = "Nice";

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
      if (!player) continue;

      const playerData = {
        user_id: "----",
        id: player.id,
        name: player.name,
        firstname: player.firstname,
        lastname: player.lastname,
        age: player.age,
        club: club,
        number: player.number,
        photo: player.photo,
        position: player.position,
        height: player.height,
        weight: player.weight,
        nationality: player.nationality,
        birthdate: player.birthdate?.date,
        video: "----",
      };
      results.push(playerData);
    } catch (err) {
      console.error(`❌ Error for player ${id} in season`, err);
    }

    fs.writeFileSync(`${club}.json`, JSON.stringify(results, null, 2), "utf-8");
    console.log(`✅ All player profiles saved to ${club}.json`);
  }
}

// Example: Run for multiple players
fetchPlayerStats([
  2274, 21079, 175171, 401493, 49583, 22163, 196343, 162465, 313937, 462277,
  482467, 444562, 437498, 339620, 407017, 25008, 4399, 240, 107, 1914, 334879,
  193617, 662, 21153, 442866, 3099, 504157, 30531, 69971, 161919, 21592, 274312,
  137303, 502387, 477124, 503702,
]);
