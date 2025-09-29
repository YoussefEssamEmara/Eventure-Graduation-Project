const fs = require("fs");
const path = require("path");

const logError = (error) => {
  const logEntry = `${new Date().toISOString()} - ${error.stack || error}\n`;
  fs.appendFile(path.join(__dirname, "../logs/error.log"), logEntry, (err) => {
    if (err) console.error("Error writing to log file:", err);
  });
};

module.exports = logError;