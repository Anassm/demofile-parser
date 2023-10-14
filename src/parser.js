"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const demofile_1 = __importDefault(require("demofile"));
const path_1 = __importDefault(require("path"));
const demoFilePath = process.argv[2];
const demoFile = new demofile_1.default.DemoFile();
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
  const jsonFileName = path_1.default.basename(demoFilePath, ".dem") + ".json";
  const jsonFilePath = path_1.default.join(
    path_1.default.dirname(demoFilePath),
    jsonFileName
  );
  fs_1.default.writeFileSync(
    jsonFilePath,
    JSON.stringify(extractedData, null, 2)
  );
  console.log(`Data saved to ${jsonFilePath}`);
});
fs_1.default.readFile(demoFilePath, (err, data) => {
  if (err) {
    console.log(`Error reading demo file: ${err}`);
    return;
  }
  demoFile.parse(data);
});
