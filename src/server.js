const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const { requireAuth } = require("./middleware/authMiddleware");

const app = express(); // ✅ MUST COME FIRST
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const parentHomeworkRoutes = require("./routes/parentHomeworkRoutes");
const marksRoutes = require("./routes/marksRoutes");
const errorHandler = require("./middleware/errorHandler");
const morgan = require("morgan");
app.use(morgan("dev"));

app.use(errorHandler);

app.use("/api/marks", marksRoutes);

app.use("/api/parent/homework", parentHomeworkRoutes);

app.use("/api/homework", homeworkRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/classes", classRoutes);

app.use("/api/teachers", teacherRoutes);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);

app.get("/api/protected", requireAuth, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("School Management Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
