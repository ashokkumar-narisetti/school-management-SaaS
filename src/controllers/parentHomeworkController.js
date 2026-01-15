const prisma = require("../prisma");

exports.getHomeworkForParent = async (req, res) => {
  if (req.user.role !== "PARENT") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Find the student linked to this parent
  const student = await prisma.student.findFirst({
    where: {
      parentUserId: req.user.userId,
      schoolId: req.user.schoolId
    }
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Fetch homework for student's class
  const homework = await prisma.homework.findMany({
    where: {
      classId: student.classId,
      schoolId: req.user.schoolId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json({
    studentName: student.fullName,
    homework
  });
};
