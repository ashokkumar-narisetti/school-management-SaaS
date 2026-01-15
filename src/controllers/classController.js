const prisma = require("../prisma");

exports.createClass = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Class name required" });
  }

  if (req.user.role !== "SCHOOL_ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const existing = await prisma.class.findFirst({
    where: {
      name,
      schoolId: req.user.schoolId
    }
  });

  if (existing) {
    return res.status(409).json({ message: "Class already exists" });
  }

  const newClass = await prisma.class.create({
    data: {
      name,
      schoolId: req.user.schoolId
    }
  });

  res.status(201).json({
    message: "Class created",
    classId: newClass.id,
    name: newClass.name
  });
};
