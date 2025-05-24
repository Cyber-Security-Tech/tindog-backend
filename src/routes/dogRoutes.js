const express = require('express');
const router = express.Router();
const dogController = require('../controllers/dogController');

// GET /api/dogs?breed=Beagle&age=3
router.get('/', dogController.getAllDogs);

// GET /api/dogs/breeds → returns list of breeds with counts
router.get('/breeds', dogController.getBreedCounts);

module.exports = router;
