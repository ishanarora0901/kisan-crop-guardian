const express = require('express');
const router = express.Router();
const {
  uploadAndScanImage,
  getDiseaseHistory,
  getDiseaseById,
} = require('../controllers/diseaseDetectionController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/scan', upload.single('image'), uploadAndScanImage);
router.get('/history', getDiseaseHistory);
router.get('/:id', getDiseaseById);

module.exports = router;
