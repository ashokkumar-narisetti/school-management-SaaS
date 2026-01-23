const prisma = require("../prisma");

exports.logAudit = async ({
  action,
  actorId,
  targetId,
  targetType,
  meta = {}
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        actorId,
        targetId,
        targetType,
        meta
      }
    });
  } catch (err) {
    console.error("AUDIT LOG FAILED:", err);
    // IMPORTANT: never block main flow because of audit logs
  }
};
