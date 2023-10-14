"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const demoDirectory = "PLACEHOLDER";
const parserScript = path_1.default.join(__dirname, "parser.ts");
const watcher = chokidar_1.default.watch(demoDirectory, {
    ignored: /(^|[/\\])\../,
    persistent: true,
});
watcher
    .on("add", (filePath) => {
    if (filePath.endsWith(".dem")) {
        console.log(`New demo file detected: ${filePath}`);
        // Trigger parsing process
        const parserProcess = (0, child_process_1.spawn)("node", [parserScript, filePath]);
        parserProcess.on("exit", (code, signal) => {
            if (code === 0) {
                console.log("Parsing process completed successfully.");
            }
            else {
                console.error(`Parsing process exited with code ${code} and signal ${signal}`);
            }
        });
    }
})
    .on("error", (error) => {
    console.error(`Watcher error: ${error}`);
});
console.log(`Watching directory: ${demoDirectory}`);
