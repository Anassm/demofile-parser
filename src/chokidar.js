"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const demoDirectory = "C:/Users/amous/Desktop/demos";
const parserScript = path_1.default.join(__dirname, "parser.js");
const watcher = chokidar_1.default.watch(demoDirectory, {
    ignored: /(^|[/\\])\../,
    persistent: true,
});
let isParsing = false;
watcher
    .on("add", (filePath) => {
    if (filePath.endsWith(".dem")) {
        console.log(`New demo file detected: ${filePath}`);
        if (!isParsing) {
            isParsing = true;
            console.log(`Waiting for demo to be ready...`);
            let previousSize = 0;
            let checkInterval = setInterval(() => {
                const currentSize = fs_1.default.statSync(filePath).size;
                if (previousSize === currentSize) {
                    clearInterval(checkInterval);
                    // Trigger parsing process
                    console.log(`TESTING | filePath var equals ${filePath}`);
                    console.log(`TESTING | check if filePath is the same as when it got detected above`);
                    console.log(`TESTING | parserScript path is ${parserScript}`);
                    const parserProcess = (0, child_process_1.spawn)("node", [parserScript, filePath]);
                    console.log("Starting parsing process");
                    parserProcess.on("exit", (code, signal) => {
                        if (code === 0) {
                            console.log("Parsing process completed successfully.");
                        }
                        else {
                            console.error(`Parsing process exited with code ${code} and signal ${signal}`);
                        }
                        isParsing = false;
                    });
                }
                else {
                    previousSize = currentSize;
                }
            }, 3000);
        }
    }
})
    .on("error", (error) => {
    console.error(`Watcher error: ${error}`);
});
console.log(`Watching directory: ${demoDirectory}`);
