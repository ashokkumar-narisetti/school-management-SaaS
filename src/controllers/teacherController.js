const bcrypt = require("bcrypt");
const prisma = require("../prisma");

exports.createTeacher = async (req, res) => {
  const { name, username, mobile, password, className } = req.body;

  if (!name || !username || !mobile || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const teacher = await prisma.teacher.create({
    data: {
      name,
      username,
      mobile,
      password: hashed,
      className,
    },
  });

  res.json(teacher);
};

exports.getTeachers = async (req, res) => {
  const teachers = await prisma.teacher.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(teachers);
};
