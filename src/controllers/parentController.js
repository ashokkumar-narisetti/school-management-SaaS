const prisma = require("../prisma");

/**
 * Parent profile
 */
exports.getParentProfile = async (req, res, next) => {
  try {
    const parent = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        // createdAt: true
      }
    });

    res.json(parent);
  } catch (err) {
    next(err);
  }
};

/**
 * Get children of logged-in parent
 */
exports.getMyChildren = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        parentUserId: req.user.userId
      },
      select: {
        id: true,
        fullName: true,
        classId: true,
        // createdAt: true
      }
    });

    res.json(students);
  } catch (err) {
    next(err);
  }
};

/**
 * Attendance of a child
 */
// GET /api/parent/attendance/:studentId
exports.getChildAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId,
        student: {
          parentUserId: req.user.userId
        }
      },
      select: {
        date: true,
        status: true
      },
      orderBy: {
        date: "desc"
      }
    });

    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

/**
 * Homework of a child
 */
exports.getChildHomework = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const homework = await prisma.homework.findMany({
      where: {
        class: {
          students: {
            some: {
              id: studentId,
              parentUserId: req.user.userId
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(homework);
  } catch (err) {
    next(err);
  }
};

/**
 * Marks of a child
 */
// GET /api/parent/marks/:studentId
exports.getChildMarks = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const marks = await prisma.mark.findMany({
      where: {
        studentId,
        student: {
          parentUserId: req.user.userId
        }
      },
      select: {
        subject: true,
        examName: true,
        score: true
      },
      orderBy: {
        examName: "asc"
      }
    });

    res.json(marks);
  } catch (err) {
    next(err);
  }
};

