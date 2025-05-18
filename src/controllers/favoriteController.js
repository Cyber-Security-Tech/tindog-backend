// src/controllers/favoriteController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get current user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { dog: true },
    });

    const favoritedDogs = favorites.map(fav => fav.dog);
    res.json(favoritedDogs);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to load favorites' });
  }
};

// Toggle favorite dog
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dogId } = req.params;

    const existing = await prisma.favorite.findFirst({
      where: { userId, dogId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ message: 'Removed from favorites' });
    } else {
      await prisma.favorite.create({
        data: { userId, dogId },
      });
      return res.json({ message: 'Added to favorites' });
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
};

// ❗ NEW: Remove favorite (used by DELETE /api/favorites/:dogId)
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dogId } = req.params;

    await prisma.favorite.deleteMany({
      where: { userId, dogId },
    });

    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
