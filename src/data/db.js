const API_KEY = "22f5e301fb035d7964c542811090953f";
const TEAM_IDS = [487, 488, 489, 490, 492, 494, 495, 496, 497, 499];
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
