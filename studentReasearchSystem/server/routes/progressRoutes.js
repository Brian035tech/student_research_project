const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const progressController = require("../controllers/progressController");


// Student submits progress
router.post(
    "/",
    verifyToken,
    authorizeRoles("student"),
    progressController.addProgress
);
// Supervisor views assigned student progress
router.get(
    "/assigned",
    verifyToken,
    authorizeRoles("supervisor"),
    progressController.getAssignedProgress
);
// Supervisor updates progress status
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("supervisor"),
    progressController.updateProgressStatus
);
module.exports = router;