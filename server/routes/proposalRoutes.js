const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const proposalController = require("../controllers/proposalController");

// Student uploads or resubmits a proposal
router.post(
    "/upload",
    verifyToken,
    authorizeRoles("student"),
    upload.single("file"),
    proposalController.uploadProposal
);

// Supervisor views proposals from assigned students
router.get(
    "/assigned",
    verifyToken,
    authorizeRoles("supervisor"),
    proposalController.getAssignedProposals
);

// Student views their own proposal
router.get(
    "/my-proposal",
    verifyToken,
    authorizeRoles("student"),
    proposalController.getMyProposal
);
// Supervisor approves a proposal or requests revisions
router.put(
    "/review",
    verifyToken,
    authorizeRoles("supervisor"),
    proposalController.reviewProposal
);
module.exports = router;