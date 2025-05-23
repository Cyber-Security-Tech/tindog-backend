const express = require('express');
const router = express.Router();
const dogController = require('../controllers/dogController');

// GET /api/dogs?breed=Beagle&age=3
router.get('/', dogController.getAllDogs);

module.exports = router;
