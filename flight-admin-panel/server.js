const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// ✅ CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5175'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true
}));

// Connect to MongoDB (optional for now)
// const connectDB = require('./config/db');
// connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));

// Default route (for testing server)
app.get('/', (req, res) => {
  res.send('✈️ Tripar API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
