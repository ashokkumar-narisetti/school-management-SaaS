const prisma = require("../prisma");
const bcrypt = require("bcrypt");

exports.createStudent = async (req, res) => {
  try {
    const { fullName, classId, parentUsername, parentPassword } = req.body;

    if (!fullName || !classId || !parentUsername || !parentPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (req.user.role !== "SCHOOL_ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ensure class belongs to same school
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: req.user.schoolId
      }
    });

    if (!classData) {
      return res.status(400).json({ message: "Invalid class" });
    }

    // create parent user
    const passwordHash = await bcrypt.hash(parentPassword, 10);

    const parentUser = await prisma.user.create({
      data: {
        username: parentUsername,
        passwordHash,
        role: "PARENT",
        schoolId: req.user.schoolId,
        mustChangePassword: true
      }
    });

    // create student
    const student = await prisma.student.create({
      data: {
        fullName,
        schoolId: req.user.schoolId,
        classId,
        parentUserId: parentUser.id
      }
    });

    res.status(201).json({
      message: "Student created",
      studentId: student.id,
      parentUsername
    });
  } catch (err) {
    console.error("CREATE STUDENT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
