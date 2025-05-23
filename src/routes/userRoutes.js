// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controllers/userController');

// User signup
router.post('/signup', signupUser);

// User login
router.post('/login', loginUser);

module.exports = router;
