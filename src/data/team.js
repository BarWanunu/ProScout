import fetch from "node-fetch";
import fs from "fs";
const API_KEY = "13bfe36622339b25026ac3582161b87e";

async function fetchPlayerStats(playerIds) {
  const results = [];
  const club = "Wolves";

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
  1590, 19341, 19143, 82855, 18742, 21138, 135334, 135068, 195717, 19147, 130,
  41606, 388777, 303322, 449245, 283272, 408893, 3080, 157912, 265784, 195103,
  144732, 2056, 20665, 401098, 2032, 1165, 24888, 7722, 282770, 282126, 925,
  385726, 380653, 456206, 389302, 303019,
]);
