const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const topicController = require("../controllers/topicController");

// Get topics
router.get(
    "/",
    verifyToken,
    authorizeRoles("student", "lecturer", "admin"),
    topicController.getTopics
);

// Student submits a research topic
router.post(
    "/",
    verifyToken,
    authorizeRoles("student"),
    topicController.createTopic
);

// Lecturer approves or rejects a topic
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("lecturer"),
    topicController.updateTopicStatus
);

// Lecturer assigns a supervisor
router.put(
    "/:id/assign-supervisor",
    verifyToken,
    authorizeRoles("lecturer"),
    topicController.assignSupervisor
);

// Supervisor views assigned topics
router.get(
    "/assigned",
    verifyToken,
    authorizeRoles("supervisor"),
    topicController.getAssignedTopics
);
// Student views assigned supervisor
router.get(
    "/supervisor",
    verifyToken,
    authorizeRoles("student"),
    (req, res, next) => {
        console.log(">>> /topics/supervisor route reached");
        next();
    },
    topicController.getAssignedSupervisor
);

router.put(
    "/:id/feedback",
    verifyToken,
    authorizeRoles("supervisor"),
    topicController.giveFeedback
);
module.exports = router;