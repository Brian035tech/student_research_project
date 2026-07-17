const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");
const submissionController = require("../controllers/submissionController");
console.log(submissionController);
console.log("uploadSubmission:", submissionController.uploadSubmission);
console.log("getSubmission:", submissionController.getSubmission);

// Student uploads final project
router.post(
    "/",
    verifyToken,
    authorizeRoles("student"),
    upload.single("document"),
    submissionController.uploadSubmission
);

// Student views submitted project
router.get(
    "/",
    verifyToken,
    authorizeRoles("student"),
    submissionController.getSubmission
);

module.exports = router;