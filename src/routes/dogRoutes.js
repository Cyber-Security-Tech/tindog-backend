const express = require('express');
const router = express.Router();
const dogController = require('../controllers/dogController');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /api/dogs?breed=Beagle&age=3
router.get('/', dogController.getAllDogs);

// GET /api/dogs/breeds → returns list of breeds with counts
router.get('/breeds', dogController.getBreedCounts);

// POST /api/dogs → create a new adoptable dog (protected)
router.post('/', requireAuth, dogController.createDog);

module.exports = router;
