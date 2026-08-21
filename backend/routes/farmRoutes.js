const express = require('express');
const router = express.Router();
const { createFarm, getFarms, getFarmById, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(createFarm).get(getFarms);
router.route('/:id').get(getFarmById).put(updateFarm).delete(deleteFarm);

module.exports = router;
