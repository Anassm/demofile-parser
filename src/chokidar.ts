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

            console.log("Starting parsing process");

            // Trigger parsing process
            const parserProcess = spawn("node", [parserScript, filePath]);

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
