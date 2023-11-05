"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const demofile_1 = require("demofile");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const demoFilePath = process.argv[2];
const demoFile = new demofile_1.DemoFile();
const fileName = path_1.default.basename(demoFilePath);
demoFile.on("start", () => {
    (0, logger_1.log)("Starting to parse the demo file...", fileName);
});
demoFile.on("end", () => {
    const players = demoFile.entities.players.slice();
    const mapName = demoFile.header.mapName;
    const matchData = {
        ctScore: demoFile.teams[3 /* TeamNumber.CounterTerrorists */].score,
        tScore: demoFile.teams[2 /* TeamNumber.Terrorists */].score,
    };
    const playerData = players.map((player) => ({
        name: player.name,
        steamId: player.steamId,
    }));
    const jsonFileName = path_1.default.basename(demoFilePath, ".dem") + ".json";
    const jsonFilePath = path_1.default.join(path_1.default.dirname(demoFilePath), jsonFileName);
    try {
        const extractedData = {
            matchData: matchData,
            players: playerData,
            mapName: mapName,
        };
        fs_1.default.writeFileSync(jsonFilePath, JSON.stringify(extractedData, null, 2));
        (0, logger_1.log)(`Demo file successfully parsed.`, fileName);
        (0, logger_1.log)(`Data saved to: ${jsonFilePath}`, fileName);
    }
    catch (error) {
        (0, logger_1.logError)(`Error saving data to ${jsonFilePath}: ${error.message}`, fileName);
    }
});
fs_1.default.readFile(demoFilePath, (err, data) => {
    if (err) {
        (0, logger_1.logError)(`Error reading demo file: ${err.message}`, fileName);
        return;
    }
    (0, logger_1.log)(`Reading demo file: ${demoFilePath}`, fileName);
    demoFile.parse(data);
});
