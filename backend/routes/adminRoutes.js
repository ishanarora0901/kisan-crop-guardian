const express = require('express');
const router = express.Router();
const {
  getPlatformAnalytics,
  getAllUsers,
  updateUserByAdmin,
  verifySpecialist,
  broadcastAlert,
  getBlockchainLedger,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getPlatformAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.put('/specialists/:id/verify', verifySpecialist);
router.post('/broadcast-alert', broadcastAlert);
router.get('/blockchain-ledger', getBlockchainLedger);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
