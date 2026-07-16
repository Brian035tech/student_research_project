const express = require("express");
const router = express.Router();

const lecturerController = require("../controllers/lecturerController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// Test route
router.get("/test", (req, res) => {
    res.json({ message: "Test route works" });
});


// Get all topics for lecturer
router.get(
    "/topics",
    verifyToken,
    authorizeRoles("lecturer"),
    lecturerController.getAllTopics
);


// Approve / Reject topic
router.put(
    "/topics/:id",
    verifyToken,
    authorizeRoles("lecturer"),
    lecturerController.reviewTopic
);


// Lecturer Dashboard
router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("lecturer"),
    lecturerController.getDashboardStats
);


module.exports = router;