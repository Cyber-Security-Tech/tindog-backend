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
      filters.age = String(age); // convert age to string for filtering
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

// POST /api/dogs → create a new dog post (auth required)
exports.createDog = async (req, res) => {
  try {
    const { name, breed, age, about, image } = req.body;

    if (!name || !breed || !age || !about || !image) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newDog = await prisma.dog.create({
      data: {
        name,
        breed,
        age: String(age), // convert age to string for schema compatibility
        about,
        image,
        user: {
          connect: {
            id: req.user.userId // fix for token-based user ID
          }
        }
      }
    });

    console.log('[Dogs] New dog posted by user:', req.user.userId);
    res.status(201).json(newDog);
  } catch (err) {
    console.error('[Dogs] Error creating dog:', err);
    res.status(500).json({ error: 'Failed to post dog' });
  }
};
