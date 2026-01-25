const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const parentHomeworkRoutes = require("./routes/parentHomeworkRoutes");
const marksRoutes = require("./routes/marksRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const schoolAdminRoutes = require("./routes/schoolAdminRoutes");

const { requireAuth } = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* ---------- ROUTES ---------- */
app.use("/api/school-admin", schoolAdminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/parent/homework", parentHomeworkRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/super-admin", superAdminRoutes);

/* ---------- TEST ROUTES ---------- */
app.get("/api/protected", requireAuth, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("School Management Backend is running");
});

/* ---------- ERROR HANDLER (LAST) ---------- */
app.use(errorHandler);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("DB URL exists:", !!process.env.DATABASE_URL);
