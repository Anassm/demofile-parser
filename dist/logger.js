"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.log = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logFilePath = path_1.default.join(__dirname, "../log.txt");
function log(message, fileName) {
    const timestamp = new Date().toLocaleString();
    const consoleFileName = fileName ? `, ${fileName}` : "";
    const logMessage = `[${timestamp + consoleFileName}] ${message}\n`;
    fs_1.default.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error(`Error writing to log file: ${err.message}`);
        }
    });
    console.log(logMessage);
}
exports.log = log;
function logError(message, fileName) {
    const timestamp = new Date().toLocaleString();
    const errorMessage = `[${timestamp}, ${fileName}] ERROR: ${message}\n`;
    fs_1.default.appendFile(logFilePath, errorMessage, (err) => {
        if (err) {
            console.log(`Error writing error message to log file: ${err.message}`);
        }
    });
    console.error(errorMessage);
}
exports.logError = logError;
