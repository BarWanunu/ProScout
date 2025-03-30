const API_KEY = "13bfe36622339b25026ac3582161b87e";

async function fetchTeamPlayers() {
  try {
    // Fetch data for team 33
    const response = await fetch(
      "https://v3.football.api-sports.io/players/squads?team=82",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": API_KEY,
        },
      }
    );

    // Convert response to JSON
    const data = await response.json();

    // Extract the "players" array from the JSON
    const players = data.response[0].players;

    // Map over the array to get all player IDs
    const playerIds = players.map((player) => player.id);

    console.log("Player IDs:", playerIds);
  } catch (error) {
    console.error("Error fetching team players:", error);
  }
}

// Call the function
fetchTeamPlayers();
