const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const adminController = require("../controllers/adminController");

// Dashboard Statistics
router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getDashboardStats
);

// Manage Users
router.get(
    "/users",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getAllUsers
);

router.delete(
    "/users/:id",
    verifyToken,
    authorizeRoles("admin"),
    adminController.deleteUser
);

// Research Topics
router.get(
    "/topics",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getAllTopics
);

// Final Submissions
router.get(
    "/submissions",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getFinalSubmissions
);

// Admin Profile
router.get(
    "/profile",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getProfile
);

module.exports = router;