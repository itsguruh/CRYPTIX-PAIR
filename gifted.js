// gifted.js - main entrypoint
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes
const pairRouter = require("./pair.js"); // ✅ make sure pair.js is in same folder

// home route
app.get("/", (req, res) => {
  res.send("🚀 Cryptix MD Pairing Server is running!");
});

// use pair routes
app.use("/", pairRouter);

// start server
app.listen(PORT, () => {
  console.log(`🚀 Cryptix MD running on port ${PORT}`);
});
