// gifted.js - main entry
const express = require("express");
const path = require("path");
const fs = require("fs-extra");

const app = express();
const PORT = process.env.PORT || 3000;

// Routers
const qrRouter = require("./qr.js");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", qrRouter);

// Health check endpoint (Render needs this to confirm app is alive)
app.get("/health", (req, res) => {
  res.status(200).send("✅ Cryptix MD is running!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cryptix MD running on port ${PORT}`);
});
