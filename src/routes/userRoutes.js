const express = require('express');
const router = express.Router();
const {
  signupUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount
} = require('../controllers/userController');

const auth = require('../middleware/authMiddleware');

// User signup
router.post('/signup', signupUser);

// User login
router.post('/login', loginUser);

// Get current logged-in user's profile (protected)
router.get('/me', auth, getCurrentUser);

// Update name/email of current user (protected)
router.patch('/me', auth, updateUserProfile);

// Change password (protected)
router.post('/change-password', auth, changeUserPassword);

// Delete account (protected)
router.delete('/me', auth, deleteUserAccount);

module.exports = router;
