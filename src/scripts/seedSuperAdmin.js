const prisma = require("../prisma");
const { hashPassword } = require("../utils/auth");

async function seed() {
  const passwordHash = await hashPassword("superadmin123");

  await prisma.user.create({
    data: {
      username: "superadmin",
      passwordHash,
      role: "SUPER_ADMIN",
      active: true,
      mustChangePassword: false,
    },
  });

  console.log("✅ Super Admin created");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
