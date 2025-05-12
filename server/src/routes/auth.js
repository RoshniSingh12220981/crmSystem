const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  getMe,
  logout,
  googleCallback,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

// Local auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router; 