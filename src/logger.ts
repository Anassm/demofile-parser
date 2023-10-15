import fs from "fs";
import path from "path";

const logFilePath: string = path.join(__dirname, "../log.txt");

function log(message: string, fileName?: string) {
  const timestamp = new Date().toLocaleString();
  const consoleFileName = fileName ? `, ${fileName}` : "";
  const logMessage = `[${timestamp + consoleFileName}] ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err.message}`);
    }
  });

  console.log(logMessage);
}

function logError(message: string, fileName?: string) {
  const timestamp = new Date().toLocaleString();
  const errorMessage = `[${timestamp}, ${fileName}] ERROR: ${message}\n`;

  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) {
      console.log(`Error writing error message to log file: ${err.message}`);
    }
  });

  console.error(errorMessage);
}

export { log, logError };
