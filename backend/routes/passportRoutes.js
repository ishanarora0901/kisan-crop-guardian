const express = require('express');
const router = express.Router();
const { getPassportByCycle, getPassportById, addPassportBlock } = require('../controllers/passportController');
const { protect } = require('../middleware/auth');

// Public verification route for buyers & insurers
router.get('/verify/:passportId', getPassportById);

// Authenticated routes
router.get('/cycle/:cropCycleId', protect, getPassportByCycle);
router.post('/:passportId/block', protect, addPassportBlock);

module.exports = router;
