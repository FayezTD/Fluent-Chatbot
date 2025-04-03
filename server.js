const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Get port from environment or use 8080 (Azure's default expected port)
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});