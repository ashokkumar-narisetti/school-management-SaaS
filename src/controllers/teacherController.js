const prisma = require("../prisma");
const bcrypt = require("bcrypt");

exports.createTeacher = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { fullName, dob } = req.body;

  if (!fullName || !dob) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (req.user.role !== "SCHOOL_ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const username = fullName.toLowerCase().replace(/\s+/g, "");
  const passwordHash = await bcrypt.hash(dob, 10);

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
};
exports.getTeacherClasses = async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      where: {
        schoolId: req.user.schoolId
      },
      select: {
        id: true,
        name: true
      }
    });

    res.json(classes);
  } catch (err) {
    next(err);
  }
};
exports.getStudents = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        schoolId: req.user.schoolId
      },
      select: {
        id: true,
        fullName: true,
        classId: true
      }
    });

    res.json(students);
  } catch (err) {
    next(err);
  }
};
exports.getTeacherStudents = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        schoolId: req.user.schoolId
      },
      select: {
        id: true,
        fullName: true,
        class: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(students);
  } catch (err) {
    next(err);
  }
};
