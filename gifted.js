const fs = require('fs');
const path = require('path');

// Utility to log messages with CRYPTIX-PAIR prefix
function giftedLog(message) {
  console.log(`[CRYPTIX-PAIR] ${message}`);
}

// Utility to read a JSON file safely
function readJson(file) {
  try {
    const data = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    giftedLog(`Error reading JSON file: ${file}`);
    return {};
  }
}

// Utility to write a JSON file safely
function writeJson(file, data) {
  try {
    fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
    giftedLog(`File updated: ${file}`);
  } catch (err) {
    giftedLog(`Error writing JSON file: ${file}`);
  }
}

module.exports = {
  giftedLog,
  readJson,
  writeJson
};
