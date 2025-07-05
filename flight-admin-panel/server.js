const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Connect to MongoDB
// connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));

// Default route (optional)
app.get('/', (req, res) => {
  res.send('✈️ Tripar API is running...');
});

// Error handling middleware (optional for debugging)
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
