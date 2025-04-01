import fetch from "node-fetch";
import fs from "fs";
const API_KEY = "13bfe36622339b25026ac3582161b87e";

async function fetchPlayerStats(playerIds) {
  const results = [];
  const club = "Verona";

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
  30611, 30912, 31383, 343570, 153408, 15909, 125715, 30922, 311071, 14327,
  274299, 368129, 30921, 180961, 296560, 342063, 418846, 342019, 407337, 2822,
  22239, 37437, 867, 1090, 418, 194837, 25349, 395761, 236955, 162703, 343287,
  454348, 59421, 408634, 359100,
]);
