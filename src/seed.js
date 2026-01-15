const prisma = require("./prisma");
const bcrypt = require("bcrypt");

async function seedSuperAdmin() {
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { username: "superadmin" },
  });

  if (existing) {
    console.log("Super admin already exists");
    return;
  }

  const school = await prisma.school.create({
    data: {
      name: "System School",
    },
  });

  await prisma.user.create({
    data: {
      username: "superadmin",
      passwordHash,
      role: "SUPER_ADMIN",
      schoolId: school.id,
      mustChangePassword: true,
    },
  });

  console.log("✅ Super admin created");
}

seedSuperAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
