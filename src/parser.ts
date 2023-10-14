import fs from "fs";
import demofile from "demofile";
import path from "path";

const demoFilePath = process.argv[2];
const demoFile = new demofile.DemoFile();

demoFile.on("start", () => {
  console.log("Parsing demo file...");
});

demoFile.on("end", () => {
  console.log("Demo file parsing complete.");

  const players = demoFile.entities.players;
  const extractedData = players.map((player) => ({
    name: player.name,
    steamId: player.steamId,
  }));

  const jsonFileName = path.basename(demoFilePath, ".dem") + ".json";
  const jsonFilePath = path.join(path.dirname(demoFilePath), jsonFileName);

  fs.writeFileSync(jsonFilePath, JSON.stringify(extractedData, null, 2));

  console.log(`Data saved to ${jsonFilePath}`);
});

fs.readFile(demoFilePath, (err, data) => {
  if (err) {
    console.log(`Error reading demo file: ${err}`);
    return;
  }

  demoFile.parse(data);
});
