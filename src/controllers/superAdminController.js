const prisma = require("../prisma");

// 1️⃣ View all schools
exports.listSchools = async (req, res) => {
  const schools = await prisma.school.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true
    }
  });
  res.json(schools);
};

// 2️⃣ Activate / Deactivate school
exports.toggleSchoolStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // ACTIVE / INACTIVE

  const school = await prisma.school.update({
    where: { id },
    data: { status }
  });

  res.json({ message: "School status updated", school });
};

// 3️⃣ View users under a school
exports.listUsersBySchool = async (req, res) => {
  const { id } = req.params;

  const users = await prisma.user.findMany({
    where: { schoolId: id },
    select: {
      id: true,
      username: true,
      role: true,
      active: true
    }
  });

  res.json(users);
};

// 4️⃣ Activate / Deactivate user
exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body; // true / false

  const user = await prisma.user.update({
    where: { id },
    data: { active }
  });

  res.json({ message: "User status updated", user });
};
