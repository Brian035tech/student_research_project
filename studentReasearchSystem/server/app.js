const topicRoutes = require("./routes/topicRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const progressRoutes = require("./routes/progressRoutes");
const lecturerRoutes = require("./routes/lecturerRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Student Research Topic Management System API");
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/lecturer", lecturerRoutes);
app.use("/api/submissions", submissionRoutes);
// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});