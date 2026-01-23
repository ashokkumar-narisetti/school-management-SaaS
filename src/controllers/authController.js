const prisma = require("../prisma");
const { comparePassword, generateToken, hashPassword } = require("../utils/auth");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = await prisma.user.findUnique({
  where: { username },
  include: { school: true }
});

if (!user) {
  return res.status(401).json({ message: "Invalid credentials" });
}

// BLOCK INACTIVE USER
if (!user.active) {
  return res.status(403).json({
    message: "Your account is deactivated. Contact admin."
  });
}

// BLOCK INACTIVE SCHOOL (except SUPER_ADMIN)
if (
  user.role !== "SUPER_ADMIN" &&
  user.school?.status !== "ACTIVE"
) {
  return res.status(403).json({
    message: "School is inactive. Access denied."
  });
}


  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);

  res.json({
    token,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  });
};

exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.userId;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Password too short" });
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: hashed,
      mustChangePassword: false,
    },
  });

  res.json({ message: "Password updated successfully" });
};
