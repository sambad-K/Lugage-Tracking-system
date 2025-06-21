const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors module
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = 5000; // You can choose any available port

// Enable CORS for all origins (you can also specify specific origins)
app.use(cors()); // This will allow requests from any origin (e.g., localhost:5174)

// Middleware to parse incoming request bodies as JSON
app.use(bodyParser.json());

// Use the adminRoutes for handling the admin form submission
app.use('/api/admin', adminRoutes);

// Connect to MongoDB (no need for deprecated options anymore)
mongoose.connect('mongodb://localhost:27017/MINOR')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
