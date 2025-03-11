const API_KEY = "22f5e301fb035d7964c542811090953f "; // Replace with your actual API key
const API_URL =
  "https://v3.football.api-sports.io/teams?league=140&season=2023";

async function fetchAllTeams() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Extracting all teams
    if (data.results > 0) {
      const teams = data.response.map((team) => ({
        id: team.team.id,
        name: team.team.name,
        founded: team.team.founded,
        country: team.team.country,
        logo: team.team.logo,
        stadium: team.venue.name,
        stadium_capacity: team.venue.capacity,
        stadium_image: team.venue.image,
      }));

      console.log("Serie A Teams 2023:", teams);
    } else {
      console.log("No teams found for this season.");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}

// Call the function
fetchAllTeams();
