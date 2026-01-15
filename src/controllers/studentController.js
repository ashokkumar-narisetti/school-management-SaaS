const prisma = require("../prisma");
const bcrypt = require("bcrypt");

exports.createStudent = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { studentName, dob, classId } = req.body;

  if (!studentName || !dob || !classId) {
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

  const parentUsername = studentName.toLowerCase().replace(/\s+/g, "");
  const passwordHash = await bcrypt.hash(dob, 10);

  const parentUser = await prisma.user.create({
    data: {
      username: parentUsername,
      passwordHash,
      role: "PARENT",
      schoolId: req.user.schoolId,
      mustChangePassword: true
    }
  });

  const student = await prisma.student.create({
    data: {
      fullName: studentName,
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
};
