const prisma = require('../lib/prisma');

// Helper: get fresh list of user's favorited dogs
const getUserFavorites = async (userId) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { dog: true },
  });
  return favorites.map(fav => fav.dog);
};

// GET: All favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favoritedDogs = await getUserFavorites(userId);
    res.json(favoritedDogs);
  } catch (err) {
    console.error('❌ Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to load favorites' });
  }
};

// POST/DELETE: Toggle favorite dog
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dogId } = req.params;

    const existing = await prisma.favorite.findFirst({
      where: { userId, dogId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      const updated = await getUserFavorites(userId);
      return res.json({ message: 'Removed from favorites', favorites: updated });
    }

    await prisma.favorite.create({
      data: { userId, dogId },
    });
    const updated = await getUserFavorites(userId);
    res.json({ message: 'Added to favorites', favorites: updated });
  } catch (err) {
    console.error('❌ Error toggling favorite:', err);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
};

// DELETE /api/favorites/:dogId
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dogId } = req.params;

    await prisma.favorite.deleteMany({
      where: { userId, dogId },
    });

    const updated = await getUserFavorites(userId);
    res.json({ message: 'Favorite removed', favorites: updated });
  } catch (err) {
    console.error('❌ Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
