const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// =====================================================
// LOOK UP STUDENT DETAILS USING STUDENT ID
// =====================================================
router.get(
"/student/:student_id",
authController.getStudentDetails
);

// =====================================================
// REGISTER PRELOADED STUDENT
// =====================================================
router.post(
"/register",
authController.register
);

// =====================================================
// LOGIN USER
// =====================================================
router.post(
"/login",
authController.login
);

module.exports = router;
