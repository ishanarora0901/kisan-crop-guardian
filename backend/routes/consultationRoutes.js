const express = require('express');
const router = express.Router();
const {
  requestConsultation,
  getConsultations,
  getConsultationById,
  sendMessage,
  prescribeAdvice,
  getAvailableSpecialists,
} = require('../controllers/consultationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(requestConsultation).get(getConsultations);
router.get('/specialists', getAvailableSpecialists);
router.get('/:id', getConsultationById);
router.post('/:id/messages', sendMessage);
router.post('/:id/prescribe', prescribeAdvice);

module.exports = router;
