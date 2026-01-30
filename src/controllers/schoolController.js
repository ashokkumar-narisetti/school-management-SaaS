const prisma = require("../prisma");
const { hashPassword } = require("../utils/auth");

/**
 * GET all schools
 */
const getAllSchools = async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(schools);
  } catch (err) {
    next(err);
  }
};

/**
 * GET users of a school
 */
const getSchoolUsers = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const users = await prisma.user.findMany({
      where: { schoolId },
      orderBy: { role: "asc" },
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * CREATE school + admin
 */
const createSchool = async (req, res, next) => {
  try {
    const { name, address, adminPassword } = req.body;

    if (!name || !address || !adminPassword) {
      return res.status(400).json({
        message: "Name, address and admin password are required",
      });
    }

    const school = await prisma.school.create({
      data: {
        name,
        address,
        status: "ACTIVE", // VALID ENUM
      },
    });

    const passwordHash = await hashPassword(adminPassword);

    await prisma.user.create({
      data: {
        username: `${name.toLowerCase().replace(/\s+/g, "_")}_admin`,
        passwordHash,
        role: "SCHOOL_ADMIN",
        schoolId: school.id,
        active: true,
        mustChangePassword: true,
      },
    });

    res.status(201).json(school);
  } catch (err) {
    next(err);
  }
};

/**
 * TOGGLE school status
 * ACTIVE <-> SUSPENDED
 */
const updateSchoolStatus = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    let newStatus;

    if (school.status === "ACTIVE") {
      newStatus = "SUSPENDED";
    } else if (school.status === "SUSPENDED") {
      newStatus = "ACTIVE";
    } else {
      return res.status(400).json({
        message: "Deleted schools cannot be reactivated",
      });
    }

    const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: { status: newStatus },
    });

    res.json(updatedSchool);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSchools,
  getSchoolUsers,
  createSchool,
  updateSchoolStatus,
};
