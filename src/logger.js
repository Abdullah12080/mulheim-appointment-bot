const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "data", "logs", "bot.log");

function log(message) {
    const timestamp = new Date().toLocaleString();

    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logFile, logMessage);

    console.log(logMessage.trim());
}

module.exports = log;