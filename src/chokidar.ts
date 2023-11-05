import chokidar from "chokidar";
import path from "path";
import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import { log, logError } from "./logger";
import { configDotenv } from "dotenv";

const envPath = path.resolve(__dirname, "../.env");
configDotenv({ path: envPath });

const demoDirectory: string = process.env.DEMOS_DIRECTORY as string;
const parserScript: string = path.join(__dirname, "parser.js");
let isParsing: boolean = false;
const parseQueue: string[] = [];

const watcher = chokidar.watch(demoDirectory, {
  ignored: /(^|[/\\])\../,
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on("add", (filePath: string) => {
    const fileName = path.basename(filePath);

    if (filePath.endsWith(".dem")) {
      log(`New demo file detected: ${fileName}`);
      parseQueue.push(filePath);
      processQueue();

      function processQueue() {
        if (!isParsing && parseQueue.length > 0) {
          const filePath = parseQueue.shift();

          if (filePath) {
            isParsing = true;

            log(`Waiting for demo to be ready`, fileName);

            let previousSize: number = 0;
            let checkInterval = setInterval(() => {
              const currentSize: number = fs.statSync(filePath).size;

              if (previousSize === currentSize) {
                clearInterval(checkInterval);

                // Trigger parsing process
                const parserProcess: ChildProcess = spawn("node", [
                  parserScript,
                  filePath,
                ]);
                log("Starting parsing process", fileName);

                parserProcess.on(
                  "exit",
                  (code: number, signal: string | null) => {
                    if (code === 0) {
                      log(
                        "Demo parsed successfully, JSON file added to directory",
                        fileName
                      );
                      log(
                        `Watching directory for new demo files: ${demoDirectory}`
                      );
                    } else {
                      logError(
                        `Parsing process exited with code ${code} and signal ${
                          signal || "unknown"
                        }`,
                        fileName
                      );
                    }
                    isParsing = false;
                    processQueue();
                  }
                );
              } else {
                previousSize = currentSize;
              }
            }, 3000);
          }
        }
      }
    }
  })
  .on("error", (error: Error) => {
    logError(`Watcher error: ${error.message}`);
  });

if (demoDirectory) {
  log(`Watching directory: ${demoDirectory}`);
} else {
  logError(
    "DEMO_DIRECTORY environment variable most likely not set in your .env file."
  );
}
