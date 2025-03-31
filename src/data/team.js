import fetch from "node-fetch";
import fs from "fs";
const API_KEY = "13bfe36622339b25026ac3582161b87e";

async function fetchPlayerStats(playerIds) {
  const results = [];
  const club = "Augsburg";

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
        club: "",
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
  119113, 21565, 21566, 193501, 22141, 3335, 20661, 22138, 21434, 333118, 999,
  179399, 486620, 350388, 451955, 320, 3336, 21443, 21439, 128287, 387120,
  326088, 369676, 342228, 490138, 113581, 21591, 22102, 399906, 349616, 459711,
  355076, 395760, 361383, 368812,
]);
