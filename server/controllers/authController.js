const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =====================================================
// LOOK UP STUDENT DETAILS USING STUDENT ID
// =====================================================
exports.getStudentDetails = (req, res) => {
const { student_id } = req.params;

if (!student_id) {
    return res.status(400).json({
        message: "Student ID is required."
    });
}

const sql = `
    SELECT
        student_name,
        student_id,
        school,
        department,
        course,
        is_registered
    FROM students
    WHERE student_id = ?
`;

db.query(sql, [student_id], (err, results) => {
    if (err) {
        return res.status(500).json({
            error: err.message
        });
    }

    if (results.length === 0) {
        return res.status(404).json({
            message: "Student ID not found. Please contact the administrator."
        });
    }

    const student = results[0];

    if (student.is_registered === 1) {
        return res.status(400).json({
            message: "This student ID has already been registered. Please log in."
        });
    }

    return res.status(200).json({
        message: "Student details found.",
        student: {
            student_name: student.student_name,
            student_id: student.student_id,
            school: student.school,
            department: student.department,
            course: student.course
        }
    });
});


};

// =====================================================
// REGISTER PRELOADED STUDENT
// =====================================================
exports.register = async (req, res) => {
const {
student_id,
verification_password,
email,
password
} = req.body;


// Validate input
if (
    !student_id ||
    !verification_password ||
    !email ||
    !password
) {
    return res.status(400).json({
        message: "Student ID, verification password, email, and new password are required."
    });
}

try {
    // Find the preloaded student
    db.query(
        "SELECT * FROM students WHERE student_id = ?",
        [student_id],
        async (err, studentResults) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            // Student ID does not exist
            if (studentResults.length === 0) {
                return res.status(404).json({
                    message: "Student ID not found. Please contact the administrator."
                });
            }

            const student = studentResults[0];

            // Prevent duplicate registration
            if (student.is_registered === 1) {
                return res.status(400).json({
                    message: "This student ID has already been registered. Please log in."
                });
            }

            // Verify the preassigned password
            const verificationMatch = await bcrypt.compare(
                verification_password,
                student.verification_password
            );

            if (!verificationMatch) {
                return res.status(401).json({
                    message: "Invalid preassigned password."
                });
            }

            // Check whether email already exists
            db.query(
                "SELECT id FROM users WHERE email = ?",
                [email],
                async (err, emailResults) => {
                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    if (emailResults.length > 0) {
                        return res.status(400).json({
                            message: "Email already registered."
                        });
                    }

                    // Hash the student's new SRMS password
                    const hashedPassword = await bcrypt.hash(
                        password,
                        10
                    );

                    // Create the student user account
                    db.query(
                        `
                        INSERT INTO users
                        (full_name, email, password, role)
                        VALUES (?, ?, ?, 'student')
                        `,
                        [
                            student.student_name,
                            email,
                            hashedPassword
                        ],
                        (err, userResult) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            const newUserId =
                                userResult.insertId;

                            // Link user account to student profile
                            db.query(
                                `
                                UPDATE students
                                SET
                                    user_id = ?,
                                    is_registered = 1
                                WHERE id = ?
                                `,
                                [
                                    newUserId,
                                    student.id
                                ],
                                (err) => {
                                    if (err) {
                                        return res.status(500).json({
                                            error: err.message
                                        });
                                    }

                                    return res.status(201).json({
                                        message:
                                            "Student registered successfully. You can now log in."
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
} catch (error) {
    return res.status(500).json({
        error: error.message
    });
}


};

// =====================================================
// LOGIN USER
// =====================================================
exports.login = (req, res) => {
const { email, password } = req.body;


// Validate login details
if (!email || !password) {
    return res.status(400).json({
        message: "Email and password are required."
    });
}

// Find user by email
db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        // User not found
        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = results[0];

        // Compare login password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Login successful
        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    }
);


};
