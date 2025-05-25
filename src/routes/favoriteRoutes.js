// src/routes/favoriteRoutes.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware'); // Correctly import named middleware
const favoriteController = require('../controllers/favoriteController');

// Get all favorites for the logged-in user
router.get('/', requireAuth, favoriteController.getFavorites);

// Toggle favorite (add if not already, remove if already favorited)
router.post('/:dogId', requireAuth, favoriteController.toggleFavorite);

// Explicitly remove a favorite by dog ID
router.delete('/:dogId', requireAuth, favoriteController.removeFavorite);

module.exports = router;
