const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const {
  signupUser,
  loginUser,
  refreshToken,
  getCurrentUser,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount
} = require('../controllers/userController');

const { requireAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// Limit login attempts to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Signup endpoint
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  signupUser
);

// Login endpoint (rate limited)
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  loginUser
);

// Refresh token endpoint (not auth-protected)
router.post(
  '/refresh-token',
  [body('token').notEmpty().withMessage('Refresh token is required')],
  validate,
  refreshToken
);

// Get user profile
router.get('/me', requireAuth, getCurrentUser);

// Update user profile
router.patch(
  '/me',
  requireAuth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email').normalizeEmail(),
  ],
  validate,
  updateUserProfile
);

// Change password
router.post(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changeUserPassword
);

// Delete account
router.delete('/me', requireAuth, deleteUserAccount);

module.exports = router;
