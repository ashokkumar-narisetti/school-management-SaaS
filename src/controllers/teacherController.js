const prisma = require("../prisma");

/**
 * ============================
 * 👤 TEACHER PROFILE
 * ============================
 */
exports.getProfile = async (req, res, next) => {
  try {
    const teacher = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        role: true,
        schoolId: true,
        active: true,
        createdAt: true
      }
    });
    res.json(teacher);
  } catch (err) {
    next(err);
  }
};

/**
 * ============================
 * 🏫 CLASSES (by school)
 * ============================
 */
exports.getClasses = async (req, res, next) => {
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
 * ============================
 * 👨‍🎓 STUDENTS
 * ============================
 */
exports.getStudents = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        class: { select: { name: true } }
      }
    });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

/**
 * ============================
 * 🗓️ ATTENDANCE
 * ============================
 */
exports.markAttendance = async (req, res, next) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const record = await prisma.attendance.create({
      data: {
        studentId,
        schoolId: req.user.schoolId,
        date: new Date(date),
        status
      }
    });

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

/**
 * ============================
 * 📚 HOMEWORK
 * ============================
 */
exports.postHomework = async (req, res, next) => {
  try {
    const { classId, subject, content } = req.body;

    if (!classId || !subject || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const homework = await prisma.homework.create({
      data: {
        classId,
        schoolId: req.user.schoolId,
        subject,
        content
      }
    });

    res.status(201).json(homework);
  } catch (err) {
    next(err);
  }
};

/**
 * ============================
 * 📝 MARKS
 * ============================
 */
exports.addMarks = async (req, res, next) => {
  try {
    const { studentId, subject, examName, score } = req.body;

    if (!studentId || !subject || !examName || score === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const mark = await prisma.mark.create({
      data: {
        studentId,
        schoolId: req.user.schoolId,
        subject,
        examName,
        score
      }
    });

    res.status(201).json(mark);
  } catch (err) {
    next(err);
  }
};
