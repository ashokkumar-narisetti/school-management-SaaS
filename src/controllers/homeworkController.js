const prisma = require("../prisma");

exports.postHomework = async (req, res, next) => {
  try {
    const { classId, subject, content } = req.body;

    if (!classId || !subject || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ensure class belongs to same school
    const cls = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: req.user.schoolId
      }
    });

    if (!cls) {
      return res.status(403).json({ message: "Invalid class" });
    }

    const homework = await prisma.homework.create({
      data: {
        classId,
        subject,
        content,
        schoolId: req.user.schoolId
      }
    });

    res.status(201).json(homework);
  } catch (err) {
    next(err);
  }
};
