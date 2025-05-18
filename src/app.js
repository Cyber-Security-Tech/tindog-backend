const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Dog routes
app.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await prisma.dog.findMany();
        res.json(dogs);
    } catch (error) {
        console.error('Error fetching dogs:', error);
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('TinDog backend is running 🚀');
});

// User and favorite routes
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

module.exports = app;
