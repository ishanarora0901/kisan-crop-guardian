const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actorName: String,
    actorRole: String,
    action: {
      type: String,
      required: true, // e.g. "RISK_MODEL_UPDATED", "SPECIALIST_VERIFIED", "ALERT_BROADCAST", "DISEASE_SCANNED"
    },
    entityType: String,
    entityId: String,
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
