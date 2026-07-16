const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const studentController = require("../controllers/studentController");

router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("student"),
    studentController.getDashboardStats
);

module.exports = router;