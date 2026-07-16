const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

// Accessible to any logged-in user
router.get(
    "/profile",
    verifyToken,
    userController.getProfile
);

// Student only
router.get(
    "/student",
    verifyToken,
    authorizeRoles("student"),
    (req, res) => {
        res.json({
            message: "Welcome Student!",
            user: req.user
        });
    }
);

// Lecturer only
router.get(
    "/lecturer",
    verifyToken,
    authorizeRoles("lecturer"),
    (req, res) => {
        res.json({
            message: "Welcome Lecturer!"
        });
    }
);

// Supervisor only
router.get(
    "/supervisor",
    verifyToken,
    authorizeRoles("supervisor"),
    (req, res) => {
        res.json({
            message: "Welcome Supervisor!"
        });
    }
);

// Admin only
router.get(
    "/admin",
    verifyToken,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin!"
        });
    }
);
// Get all supervisors
router.get(
    "/supervisors",
    verifyToken,
    authorizeRoles("lecturer"),
    userController.getSupervisors
);
module.exports = router;