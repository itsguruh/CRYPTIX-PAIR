const express = require('express');
const router = express.Router();
const path = require('path');

// Serve the pair.html page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'));
});

// Example API endpoint for pairing
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CRYPTIX-PAIR pairing route active'
  });
});

module.exports = router;
