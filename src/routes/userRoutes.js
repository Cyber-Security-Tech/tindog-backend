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

const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// Rate limiter: max 5 login attempts per IP in 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// User signup
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  signupUser
);

// User login
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  loginUser
);

// Refresh access token
router.post(
  '/refresh-token',
  [body('token').notEmpty().withMessage('Refresh token is required')],
  validate,
  refreshToken
);

// Get current logged-in user's profile
router.get('/me', auth, getCurrentUser);

// Update user profile
router.patch(
  '/me',
  auth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email').normalizeEmail()
  ],
  validate,
  updateUserProfile
);

// Change password
router.post(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validate,
  changeUserPassword
);

// Delete account
router.delete('/me', auth, deleteUserAccount);

module.exports = router;
