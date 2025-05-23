// src/routes/favoriteRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

// Get all favorites for the logged-in user
router.get('/', auth, favoriteController.getFavorites);

// Toggle favorite (add if not already, remove if already favorited)
router.post('/:dogId', auth, favoriteController.toggleFavorite);

// Explicitly remove a favorite by dog ID
router.delete('/:dogId', auth, favoriteController.removeFavorite);

module.exports = router;
