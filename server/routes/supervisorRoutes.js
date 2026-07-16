const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const supervisorController = require("../controllers/supervisorController");


router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("supervisor"),
    supervisorController.getDashboardStats
);


module.exports = router;