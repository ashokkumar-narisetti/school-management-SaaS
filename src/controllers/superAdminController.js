const prisma = require("../prisma");

/**
 * List all schools
 */
exports.listSchools = async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(schools);
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle school active status
 */
exports.toggleSchoolStatus = async (req, res, next) => {
  try {
    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: {
        status: req.body.status
      }
    });
    res.json(school);
  } catch (err) {
    next(err);
  }
};

/**
 * List users of a school
 */
exports.listUsersBySchool = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { schoolId: req.params.id },
      select: {
        id: true,
        username: true,
        role: true,
        active: true
      }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle user active status
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        active: req.body.active
      }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Audit logs
 */
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
