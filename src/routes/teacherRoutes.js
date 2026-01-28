const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const prisma = require("../prisma");

const router = express.Router();

/**
 * 🔐 Teacher protection
*/
router.use(requireAuth, requireRole("TEACHER"));

/**
 * 👤 Teacher profile
 * GET /api/teacher/profile
*/
router.get("/profile", async (req, res, next) => {
    try {
        const teacher = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                username: true,
                role: true,
                active: true,
                schoolId: true,
                createdAt: true
            }
        });
        
        res.json(teacher);
    } catch (err) {
        next(err);
    }
});
const { getTeacherStudents } = require("../controllers/teacherController");
const { getTeacherClasses } = require("../controllers/teacherController");
router.get("/students", getTeacherStudents);
router.get("/classes", getTeacherClasses);

module.exports = router;
