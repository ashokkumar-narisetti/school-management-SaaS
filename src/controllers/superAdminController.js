const prisma = require("../prisma");
const { logAudit } = require("../utils/auditLogger");


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
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive }
    });

    await logAudit({
      action: updated.isActive ? "USER_ENABLED" : "USER_DISABLED",
      actorId: req.user.id,
      targetId: id,
      targetType: "USER",
      meta: { username: user.username, role: user.role }
    });

    res.json({
      message: `User ${updated.isActive ? "enabled" : "disabled"}`,
      user: updated
    });
  } catch (err) {
    next(err);
  }
};

