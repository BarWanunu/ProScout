const API_KEY = "46b0d1d12ea98445ccdd2d5d6a7d4d49";
const TEAM_IDS = [500, 502, 503, 504, 505, 511, 512, 514, 867, 1579];
const API_URL = "https://v3.football.api-sports.io/teams?id=";

async function fetchTeams() {
  try {
    // Fetch all teams concurrently
    const requests = TEAM_IDS.map((id) =>
      fetch(API_URL + id, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": API_KEY,
        },
      }).then((response) => response.json())
    );

    // Wait for all requests to resolve
    const teamsData = await Promise.all(requests);

    // Extract relevant information
    teamsData.forEach((data) => {
      if (data.response.length > 0) {
        const team = data.response[0].team;
        const venue = data.response[0].venue;

        console.log("Team ID:", team.id);
        console.log("Team Name:", team.name);
        console.log("Leauge Name: Serie A");
        console.log("Country:", team.country);
        console.log("Formation: ********");
        console.log("Home Stadium:", venue.name);
        console.log("Trophies won: *********");
        console.log("Logo URL:", team.logo);
        console.log("-----------------------------");
      }
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}

// Call the function
fetchTeams();
