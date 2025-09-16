// gifted.js - main server entry
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// import the pair router
const pairRouter = require("./pair");

// health check (avoid H13 crash on root "/")
app.get("/", (req, res) => {
  res.send("✅ Cryptix Pairing Server is running. Use /code endpoint.");
});

// mount pairing route
app.use("/code", pairRouter);

app.listen(PORT, () => {
  console.log(`🚀 Cryptix MD running on port ${PORT}`);
});
