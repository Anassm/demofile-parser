import fs from "fs";
import { DemoFile, Player, TeamNumber } from "demofile";
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

  const mapName: string = demoFile.header.mapName;

  const matchData: {
    ctScore: number;
    tScore: number;
  } = {
    ctScore: demoFile.teams[TeamNumber.CounterTerrorists].score,
    tScore: demoFile.teams[TeamNumber.Terrorists].score,
  };

  const playerData: { name: string; steamId: string }[] = players.map(
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
    const extractedData = {
      matchData: matchData,
      players: playerData,
      mapName: mapName,
    };

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
