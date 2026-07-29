const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const submissionController = require(
    "../controllers/submissionController"
);

console.log(
    "Keys:",
    Object.keys(submissionController)
);

console.log(
    "uploadSubmission:",
    submissionController.uploadSubmission
);

console.log(
    "getSubmission:",
    submissionController.getSubmission
);


// Student uploads final project
router.post(
    "/",
    verifyToken,
    authorizeRoles("student"),
    upload.single("document"),
    submissionController.uploadSubmission
);


// Student views their submitted project
router.get(
    "/",
    verifyToken,
    authorizeRoles("student"),
    submissionController.getSubmission
);


// Supervisor views final drafts waiting for review
router.get(
    "/supervisor",
    verifyToken,
    authorizeRoles("supervisor"),
    submissionController.getSupervisorSubmissions
);


// Supervisor approves final draft
router.put(
    "/:id/approve",
    verifyToken,
    authorizeRoles("supervisor"),
    submissionController.approveFinalDraft
);


// Supervisor requests revision
router.put(
    "/:id/revision",
    verifyToken,
    authorizeRoles("supervisor"),
    submissionController.requestRevision
);


// Admin, Supervisor and Lecturer download a submitted file
router.get(
    "/download/:id",
    verifyToken,
    authorizeRoles(
        "admin",
        "supervisor",
        "lecturer"
    ),
    submissionController.downloadSubmission
);


// Lecturer views supervisor-approved final drafts
router.get(
    "/lecturer",
    verifyToken,
    authorizeRoles("lecturer"),
    submissionController.getLecturerSubmissions
);


// Lecturer approves the final draft
router.put(
    "/lecturer/approve/:id",
    verifyToken,
    authorizeRoles("lecturer"),
    submissionController.approveByLecturer
);


module.exports = router;