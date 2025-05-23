// src/controllers/dogController.js

const prisma = require('../lib/prisma');

exports.getAllDogs = async (req, res) => {
  try {
    const { breed, age } = req.query;

    const filters = {};
    if (breed) filters.breed = breed;
    if (age) filters.age = age;

    const dogs = await prisma.dog.findMany({
      where: filters
    });

    console.log(`✅ Returned ${dogs.length} dogs with filters:`, filters);
    res.json(dogs);
  } catch (err) {
    console.error('❌ Error fetching dogs:', err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
};
