const prisma = require("../prisma");

exports.createHomework = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { classId, subject, content } = req.body;

  if (!classId || !subject || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (req.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Ensure class belongs to same school
  const classData = await prisma.class.findFirst({
    where: {
      id: classId,
      schoolId: req.user.schoolId
    }
  });

  if (!classData) {
    return res.status(400).json({ message: "Invalid class" });
  }

  const homework = await prisma.homework.create({
    data: {
      classId,
      schoolId: req.user.schoolId,
      subject,
      content
    }
  });

  res.status(201).json({
    message: "Homework posted",
    homeworkId: homework.id
  });
};
