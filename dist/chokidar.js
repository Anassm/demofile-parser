"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./logger");
const dotenv_1 = require("dotenv");
const envPath = path_1.default.resolve(__dirname, "../.env");
(0, dotenv_1.configDotenv)({ path: envPath });
const demoDirectory = process.env.DEMOS_DIRECTORY;
const parserScript = path_1.default.join(__dirname, "parser.js");
let isParsing = false;
const parseQueue = [];
const watcher = chokidar_1.default.watch(demoDirectory, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true,
});
watcher
    .on("add", (filePath) => {
    const fileName = path_1.default.basename(filePath);
    if (filePath.endsWith(".dem")) {
        (0, logger_1.log)(`New demo file detected: ${fileName}`);
        parseQueue.push(filePath);
        processQueue();
        function processQueue() {
            if (!isParsing && parseQueue.length > 0) {
                const filePath = parseQueue.shift();
                if (filePath) {
                    isParsing = true;
                    (0, logger_1.log)(`Waiting for demo to be ready`, fileName);
                    let previousSize = 0;
                    let checkInterval = setInterval(() => {
                        const currentSize = fs_1.default.statSync(filePath).size;
                        if (previousSize === currentSize) {
                            clearInterval(checkInterval);
                            // Trigger parsing process
                            const parserProcess = (0, child_process_1.spawn)("node", [
                                parserScript,
                                filePath,
                            ]);
                            (0, logger_1.log)("Starting parsing process", fileName);
                            parserProcess.on("exit", (code, signal) => {
                                if (code === 0) {
                                    (0, logger_1.log)("Demo parsed successfully, JSON file added to directory", fileName);
                                    (0, logger_1.log)(`Watching directory for new demo files: ${demoDirectory}`);
                                }
                                else {
                                    (0, logger_1.logError)(`Parsing process exited with code ${code} and signal ${signal || "unknown"}`, fileName);
                                }
                                isParsing = false;
                                processQueue();
                            });
                        }
                        else {
                            previousSize = currentSize;
                        }
                    }, 3000);
                }
            }
        }
    }
})
    .on("error", (error) => {
    (0, logger_1.logError)(`Watcher error: ${error.message}`);
});
if (demoDirectory) {
    (0, logger_1.log)(`Watching directory: ${demoDirectory}`);
}
else {
    (0, logger_1.logError)("DEMO_DIRECTORY environment variable most likely not set in your .env file.");
}
