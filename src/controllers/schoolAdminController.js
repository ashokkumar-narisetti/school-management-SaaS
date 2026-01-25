const prisma = require("../prisma");
const bcrypt = require("bcryptjs");

/**
 * School profile
 */
exports.getSchoolProfile = async (req, res, next) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId }
    });
    res.json(school);
  } catch (err) {
    next(err);
  }
};

/**
 * List teachers
 */
exports.listTeachers = async (req, res, next) => {
  try {
    const teachers = await prisma.user.findMany({
      where: {
        schoolId: req.user.schoolId,
        role: "TEACHER"
      },
      select: {
        id: true,
        username: true,
        active: true,
        createdAt: true
      }
    });
    res.json(teachers);
  } catch (err) {
    next(err);
  }
};

/**
 * Create teacher
 */
exports.createTeacher = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);

    const teacher = await prisma.user.create({
      data: {
        username,
        passwordHash: hash,
        role: "TEACHER",
        schoolId: req.user.schoolId,
        mustChangePassword: true
      }
    });

    res.status(201).json(teacher);
  } catch (err) {
    next(err);
  }
};

/**
 * Activate / deactivate teacher
 */
exports.toggleTeacherStatus = async (req, res, next) => {
  try {
    const teacher = await prisma.user.update({
      where: { id: req.params.id },
      data: { active: req.body.active }
    });
    res.json(teacher);
  } catch (err) {
    next(err);
  }
};

/**
 * List classes
 */
exports.listClasses = async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      where: { schoolId: req.user.schoolId }
    });
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

/**
 * Create class
 */
exports.createClass = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Class name required" });
    }

    const cls = await prisma.class.create({
      data: {
        name,
        schoolId: req.user.schoolId
      }
    });

    res.status(201).json(cls);
  } catch (err) {
    next(err);
  }
};
