const prisma = require("../prisma");

exports.markAttendance = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { studentId, date, status } = req.body;

  if (!studentId || !date || !status) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (req.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // ensure student belongs to same school
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId: req.user.schoolId
    }
  });

  if (!student) {
    return res.status(400).json({ message: "Invalid student" });
  }

  const attendance = await prisma.attendance.create({
    data: {
      studentId,
      schoolId: req.user.schoolId,
      date: new Date(date),
      status
    }
  });

  res.status(201).json({
    message: "Attendance marked",
    attendanceId: attendance.id
  });
};
