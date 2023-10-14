import chokidar from "chokidar";
import path from "path";
import { spawn } from "child_process";
import fs from "fs";

const demoDirectory = "PLACEHOLDER";
const parserScript = path.join(__dirname, "parser.ts");

const watcher = chokidar.watch(demoDirectory, {
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
          const currentSize = fs.statSync(filePath).size;

          if (previousSize === currentSize) {
            clearInterval(checkInterval);

            // Trigger parsing process
            console.log(`TESTING | filePath var equals ${filePath}`);
            console.log(
              `TESTING | check if filePath is the same as when it got detected above`
            );
            const parserProcess = spawn("node", [parserScript, filePath]);
            console.log("Starting parsing process");

            parserProcess.on("exit", (code, signal) => {
              if (code === 0) {
                console.log("Parsing process completed successfully.");
              } else {
                console.error(
                  `Parsing process exited with code ${code} and signal ${signal}`
                );
              }
              isParsing = false;
            });
          } else {
            previousSize = currentSize;
          }
        }, 4000);
      }
    }
  })
  .on("error", (error) => {
    console.error(`Watcher error: ${error}`);
  });

console.log(`Watching directory: ${demoDirectory}`);
