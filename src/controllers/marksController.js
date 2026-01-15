const prisma = require("../prisma");

exports.addMark = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { studentId, subject, examName, score } = req.body;

  if (!studentId || !subject || !examName || score === undefined) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (req.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Ensure student belongs to same school
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId: req.user.schoolId
    }
  });

  if (!student) {
    return res.status(400).json({ message: "Invalid student" });
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

  res.status(201).json({
    message: "Marks added",
    markId: mark.id
  });
};

exports.getMarksForParent = async (req, res) => {
  if (req.user.role !== "PARENT") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const student = await prisma.student.findFirst({
    where: {
      parentUserId: req.user.userId,
      schoolId: req.user.schoolId
    }
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const marks = await prisma.mark.findMany({
    where: {
      studentId: student.id,
      schoolId: req.user.schoolId
    }
  });

  res.json({
    studentName: student.fullName,
    marks
  });
};
