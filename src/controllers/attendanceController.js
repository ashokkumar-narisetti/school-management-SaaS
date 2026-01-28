const prisma = require("../prisma");

exports.markAttendance = async (req, res, next) => {
  try {
    const { classId, date, students } = req.body;

    if (!classId || !date || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Ensure class belongs to teacher's school
    const cls = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: req.user.schoolId
      }
    });

    if (!cls) {
      return res.status(403).json({ message: "Invalid class" });
    }

    const records = students.map(s => ({
      schoolId: req.user.schoolId,
      studentId: s.studentId,
      date: new Date(date),
      status: s.status
    }));

    await prisma.attendance.createMany({
      data: records,
      skipDuplicates: true
    });

    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    next(err);
  }
};
