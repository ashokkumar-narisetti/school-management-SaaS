const prisma = require("../prisma");
const bcrypt = require("bcryptjs");

/**
 * 📌 List all schools
 */
exports.listSchools = async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
    res.json(schools);
  } catch (err) {
    next(err);
  }
};

/**
 * 📌 Create school + school admin
 */
exports.createSchool = async (req, res, next) => {
  try {
    const { name, address, adminPassword } = req.body;

    if (!name || !adminPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const school = await prisma.school.create({
      data: {
        name,
        address,
        status: "ACTIVE"
      }
    });

    const username = `${name.toLowerCase().replace(/\s+/g, "")}@admin`;
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: "SCHOOL_ADMIN",
        schoolId: school.id,
        active: true,
        mustChangePassword: true
      }
    });

    res.status(201).json({
      message: "School created successfully",
      schoolId: school.id,
      adminUsername: username
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 📌 Activate / Deactivate school
 */
exports.toggleSchoolStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(school);
  } catch (err) {
    next(err);
  }
};

/**
 * 📌 List users of a school
 */
exports.listSchoolUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { schoolId: req.params.id },
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * 📌 Activate / Deactivate user
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { active } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { active }
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * 📌 Audit logs (last 100)
 */
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: {
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
