const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const router = express.Router();

/**
 * Test routes
 */
router.get('/status', (req, res) => res.send('OK'));
router.use('/docs', express.static('docs'));
/**
 * All routes
 */
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
