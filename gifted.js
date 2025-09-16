const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// routes
let server = require("./qr");
let code = require("./pair");

require("events").EventEmitter.defaultMaxListeners = 500;

app.use("/server", server);
app.use("/code", code);

app.use("/pair", (req, res) => {
  res.sendFile(path.join(__dirname, "pair.html"));
});

app.use("/qr", (req, res) => {
  res.sendFile(path.join(__dirname, "qr.html"));
});

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Fix: use Heroku’s dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Cryptix MD running on port ${PORT}`);
});

module.exports = app;
