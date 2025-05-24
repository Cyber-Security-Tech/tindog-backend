const prisma = require('../lib/prisma');

// GET /api/dogs?breed=Beagle&age=3
exports.getAllDogs = async (req, res) => {
  try {
    const { breed, age } = req.query;

    const filters = {};
    if (breed) {
      filters.breed = {
        equals: breed,
        mode: 'insensitive'
      };
    }

    if (age && !isNaN(parseInt(age))) {
      filters.age = parseInt(age);
    }

    const dogs = await prisma.dog.findMany({ where: filters });

    console.log(`[Dogs] Returned ${dogs.length} dog(s) with filters:`, filters);
    res.json(dogs);
  } catch (err) {
    console.error('[Dogs] Error fetching dogs:', err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
};

// GET /api/dogs/breeds → returns unique breeds with counts
exports.getBreedCounts = async (req, res) => {
  try {
    const breeds = await prisma.dog.groupBy({
      by: ['breed'],
      _count: {
        breed: true
      },
      orderBy: {
        breed: 'asc'
      }
    });

    const result = breeds.map(b => ({
      breed: b.breed,
      count: b._count.breed
    }));

    res.json(result);
  } catch (err) {
    console.error('[Dogs] Error fetching breed counts:', err);
    res.status(500).json({ error: 'Failed to fetch breed list' });
  }
};
