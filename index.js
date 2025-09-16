const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Routes
let server = require('./qr.js');
let code = require('./pair.js');

require('events').EventEmitter.defaultMaxListeners = 500;

app.use('/server', server);
app.use('/code', code);

app.use('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'));
});

app.use('/qr', (req, res) => {
  res.sendFile(path.join(__dirname, 'qr.html'));
});

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`
✅ CRYPTIX-PAIR is running successfully!
Server: http://localhost:${PORT}
`);
});

module.exports = app;
