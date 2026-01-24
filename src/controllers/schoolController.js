const prisma = require("../prisma");
const bcrypt = require("bcrypt");

exports.createSchool = async (req, res) => {
  const { name, address, adminPassword } = req.body;

  if (!name || !adminPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const school = await prisma.school.create({
    data: { name, address },
  });

  const username = `${name.toLowerCase().replace(/\s+/g, "")}@${school.id}`;
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
  data: {
    username,
    passwordHash,
    role: "SCHOOL_ADMIN",
    mustChangePassword: true,
    school: {
      connect: { id: school.id }
    }
  }
});


  res.status(201).json({
    message: "School created successfully",
    schoolId: school.id,
    adminUsername: username,
  });
};
