const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const userRoute = require('./routes/userRoutes');
const mcqRoutes = require('./routes/mcqRoutes');

const date=Date.now();

const app = express();

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Routes

app.use('/api/user', userRoute);
app.use('/api/mcqs', mcqRoutes);

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));
// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' }); // Generic error message for security
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
