const express = require("express");

const router = express.Router();

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const reportController =
    require("../controllers/reportController");


// =====================================
// RESEARCH TOPICS REPORT
// =====================================

router.get(
    "/topics",
    verifyToken,
    authorizeRoles(
        "admin",
        "lecturer"
    ),
    reportController.getTopicReport
);


// =====================================
// STUDENT PROGRESS REPORT
// =====================================

router.get(
    "/progress",
    verifyToken,
    authorizeRoles(
        "admin",
        "lecturer"
    ),
    reportController
        .getStudentProgressReport
);


// =====================================
// FINAL SUBMISSION REPORT
// =====================================

router.get(
    "/submissions",
    verifyToken,
    authorizeRoles(
        "admin",
        "lecturer"
    ),
    reportController
        .getFinalSubmissionReport
);


module.exports = router;