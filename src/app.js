const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const dogRoutes = require('./routes/dogRoutes');

const app = express();

// Basic HTTP header hardening
app.use(helmet());

// Allow frontend running on Live Server (127.0.0.1) and localhost to access the API
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500']
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('TinDog backend is running');
});

// API endpoints
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/dogs', dogRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
