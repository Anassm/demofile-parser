import fs from "fs";
import { DemoFile, Player } from "demofile";
import path from "path";
import { log, logError } from "./logger";

const demoFilePath: string = process.argv[2];
const demoFile: DemoFile = new DemoFile();
const fileName = path.basename(demoFilePath);

demoFile.on("start", () => {
  log("Starting to parse the demo file...", fileName);
});

demoFile.on("end", () => {
  const players: Player[] = demoFile.entities.players.slice();
  const extractedData: { name: string; steamId: string }[] = players.map(
    (player: Player) => ({
      name: player.name,
      steamId: player.steamId,
    })
  );

  const jsonFileName: string = path.basename(demoFilePath, ".dem") + ".json";
  const jsonFilePath: string = path.join(
    path.dirname(demoFilePath),
    jsonFileName
  );

  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(extractedData, null, 2));
    log(`Demo file successfully parsed.`, fileName);
    log(`Data saved to: ${jsonFilePath}`, fileName);
  } catch (error: any) {
    logError(
      `Error saving data to ${jsonFilePath}: ${error.message}`,
      fileName
    );
  }
});

fs.readFile(demoFilePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
  if (err) {
    logError(`Error reading demo file: ${err.message}`, fileName);
    return;
  }

  log(`Reading demo file: ${demoFilePath}`, fileName);
  demoFile.parse(data);
});
