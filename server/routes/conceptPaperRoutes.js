const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");

const authorizeRoles =
require("../middleware/roleMiddleware");

const upload =
require("../middleware/upload");

const conceptPaperController =
require("../controllers/conceptPaperController");

// =====================================
// STUDENT UPLOADS A CONCEPT PAPER
// =====================================

router.post(
"/upload",


verifyToken,

authorizeRoles("student"),

upload.single("conceptPaper"),

conceptPaperController
    .uploadConceptPaper


);

// =====================================
// STUDENT VIEWS OWN CONCEPT PAPER
// =====================================

router.get(
"/student",


verifyToken,

authorizeRoles("student"),

conceptPaperController
    .getStudentConceptPaper


);

// =====================================
// SUPERVISOR VIEWS ASSIGNED PAPERS
// =====================================

router.get(
"/supervisor",


verifyToken,

authorizeRoles("supervisor"),

conceptPaperController
    .getSupervisorConceptPapers


);

// =====================================
// SUPERVISOR REVIEWS A CONCEPT PAPER
// =====================================

router.put(
"/review/:id",


verifyToken,

authorizeRoles("supervisor"),

conceptPaperController
    .reviewConceptPaper


);

module.exports = router;
