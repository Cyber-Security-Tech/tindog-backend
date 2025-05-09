const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await prisma.dog.findMany();
        res.json(dogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

// Health check route
app.get('/', (req, res) => {
    res.send('TinDog backend is running 🚀');
});

// Start server
app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});
