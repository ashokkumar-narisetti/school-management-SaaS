const prisma = require("../prisma");
const bcrypt = require("bcryptjs");

/**
 * ============================
 * 🏫 SCHOOL PROFILE
 * ============================
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
 * ============================
 * 👨‍🏫 TEACHERS
 * ============================
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

exports.createTeacher = async (req, res, next) => {
  try {
    const { fullName, password } = req.body;

    if (!fullName || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const username = fullName.toLowerCase().replace(/\s+/g, "");
    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: "TEACHER",
        schoolId: req.user.schoolId,
        mustChangePassword: true
      }
    });

    res.status(201).json({
      message: "Teacher created",
      teacherId: teacher.id,
      username
    });
  } catch (err) {
    next(err);
  }
};

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
 * ============================
 * 🏫 CLASSES
 * ============================
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

/**
 * ============================
 * 👨‍🎓 STUDENTS + PARENTS
 * ============================
 */
exports.listStudents = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        class: { select: { name: true } },
        parent: { select: { username: true, active: true } }
      }
    });

    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { fullName, classId, parentPassword } = req.body;

    if (!fullName || !classId || !parentPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Validate class
    const cls = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: req.user.schoolId
      }
    });

    if (!cls) {
      return res.status(400).json({ message: "Invalid class" });
    }

    const parentUsername = fullName.toLowerCase().replace(/\s+/g, "");
    const passwordHash = await bcrypt.hash(parentPassword, 10);

    const parent = await prisma.user.create({
      data: {
        username: parentUsername,
        passwordHash,
        role: "PARENT",
        schoolId: req.user.schoolId,
        mustChangePassword: true
      }
    });

    const student = await prisma.student.create({
      data: {
        fullName,
        schoolId: req.user.schoolId,
        classId,
        parentUserId: parent.id
      }
    });

    res.status(201).json({
      message: "Student created",
      studentId: student.id,
      parentUsername
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleStudentStatus = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: { parent: true }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedParent = await prisma.user.update({
      where: { id: student.parentUserId },
      data: { active: req.body.active }
    });

    res.json(updatedParent);
  } catch (err) {
    next(err);
  }
};
