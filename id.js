const crypto = require('crypto');

// Generate a random unique ID
function generateId(prefix = "CRYPTIX") {
  return prefix + "-" + crypto.randomBytes(6).toString("hex");
}

// Validate if a string looks like a CRYPTIX ID
function isValidId(id, prefix = "CRYPTIX") {
  return typeof id === "string" && id.startsWith(prefix + "-");
}

module.exports = {
  generateId,
  isValidId
};
