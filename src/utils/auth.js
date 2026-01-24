const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
};
