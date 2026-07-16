const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const feedbackController = require("../controllers/feedbackController");

// Supervisor adds feedback
router.post(
    "/",
    verifyToken,
    authorizeRoles("supervisor"),
    feedbackController.addFeedback
);
// Student views feedback
router.get(
    "/",
    verifyToken,
    authorizeRoles("student"),
    feedbackController.getFeedback
);
module.exports = router;