import fs from "fs";
import path from "path";
import { Parser } from "json2csv";

const baseFolder = "./Players";
const leagueFolders = fs
  .readdirSync(baseFolder)
  .filter((folder) =>
    fs.lstatSync(path.join(baseFolder, folder)).isDirectory()
  );

const allPlayers = [];

for (const leagueFolder of leagueFolders) {
  const leaguePath = path.join(baseFolder, leagueFolder);
  const files = fs
    .readdirSync(leaguePath)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(leaguePath, file);
    const playerArray = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    allPlayers.push(...playerArray);
  }
}

const fields = [
  "user_id",
  "id",
  "name",
  "firstname",
  "lastname",
  "age",
  "club",
  "number",
  "photo",
  "position",
  "height",
  "weight",
  "nationality",
  "birthdate",
  "video",
];

const parser = new Parser({ fields });
const csv = parser.parse(allPlayers);

fs.writeFileSync("all_players.csv", csv, "utf-8");
console.log("✅ CSV created: all_players.csv");
