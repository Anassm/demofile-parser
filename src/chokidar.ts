import chokidar from "chokidar";
import path from "path";
import { spawn } from "child_process";

const demoDirectory = "PLACEHOLDER";
const parserScript = path.join(__dirname, "parser.ts");

const watcher = chokidar.watch(demoDirectory, {
  ignored: /(^|[/\\])\../,
  persistent: true,
});

watcher
  .on("add", (filePath) => {
    if (filePath.endsWith(".dem")) {
      console.log(`New demo file detected: ${filePath}`);

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
      });
    }
  })
  .on("error", (error) => {
    console.error(`Watcher error: ${error}`);
  });

console.log(`Watching directory: ${demoDirectory}`);
