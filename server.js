const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get all keys (topics)
app.get('/keys', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    const jsonData = JSON.parse(data);
    res.json(Object.keys(jsonData));
  });
});

// Endpoint to get answer for a given key
app.get('/answer', (req, res) => {
  const key = (req.query.key || '').toLowerCase();
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    const jsonData = JSON.parse(data);
    // Find matching key ignoring case and spaces
    const foundKey = Object.keys(jsonData).find(k => k.toLowerCase() === key);
    if (foundKey) {
      res.json({ answer: jsonData[foundKey] });
    } else {
      res.json({ answer: "Sorry, I don't have information on that topic." });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
