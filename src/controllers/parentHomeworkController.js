const prisma = require("../prisma");

exports.getParentHomework = async (req, res, next) => {
  try {
    // find student linked to this parent
    const student = await prisma.student.findFirst({
      where: {
        parentUserId: req.user.userId
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const homework = await prisma.homework.findMany({
      where: {
        classId: student.classId
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(homework);
  } catch (err) {
    next(err);
  }
};
