// src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all favorites for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      include: { dog: true }
    });
    res.json(favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to load favorites' });
  }
});

// Add a favorite (dogId must be sent in body)
router.post('/', auth, async (req, res) => {
  const { dogId } = req.body;
  if (!dogId) return res.status(400).json({ error: 'dogId is required' });

  try {
    const existing = await prisma.favorite.findFirst({
      where: { userId: req.user.userId, dogId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already favorited' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.userId,
        dogId
      }
    });

    res.status(201).json(favorite);
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove a favorite by dogId (used for unfavorite logic)
router.delete('/:dogId', auth, async (req, res) => {
  const { dogId } = req.params;

  try {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.userId,
        dogId
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await prisma.favorite.delete({ where: { id: existing.id } });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
