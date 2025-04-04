import fs from "fs";
import path from "path";
import { Parser } from "json2csv";

const baseFolder = "./Teams";
const leagueFolders = fs
  .readdirSync(baseFolder)
  .filter((folder) =>
    fs.lstatSync(path.join(baseFolder, folder)).isDirectory()
  );

const allTeams = [];

for (const leagueFolder of leagueFolders) {
  const leaguePath = path.join(baseFolder, leagueFolder);
  const files = fs
    .readdirSync(leaguePath)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(leaguePath, file);
    const team = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    allTeams.push(team); // Push single object instead of spreading
  }
}

const fields = [
  "id",
  "name",
  "league",
  "country",
  "formation",
  "stadium",
  "trophies",
  "logo",
];

const parser = new Parser({ fields });
const csv = parser.parse(allTeams);

fs.writeFileSync("all_teams.csv", csv, "utf-8");
console.log("✅ CSV created: all_teams.csv");
