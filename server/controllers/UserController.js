const db = require("../config/db");

// =====================================================
// GET ALL SUPERVISORS
// =====================================================
exports.getSupervisors = (req, res) => {

    const sql = `
        SELECT
            id,
            full_name,
            email
        FROM users
        WHERE role = 'supervisor'
        AND id NOT IN (
            SELECT supervisor_id
            FROM research_topics
            WHERE supervisor_id IS NOT NULL
        )
        ORDER BY full_name ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(
                "Available supervisors error:",
                err
            );

            return res.status(500).json({
                message:
                    "Failed to fetch available supervisors."
            });
        }

        res.json(results);

    });

};
// =====================================================
// GET LOGGED-IN USER PROFILE
// =====================================================
exports.getProfile = (req, res) => {
const userId = req.user.id;
const userRole = req.user.role;


// Student profile
if (userRole === "student") {

    const studentSql = `
        SELECT
            u.id,
            u.full_name,
            u.email,
            u.role,
            s.student_id,
            s.school,
            s.department,
            s.course
        FROM users u
        INNER JOIN students s
            ON s.user_id = u.id
        WHERE u.id = ?
    `;

    db.query(
        studentSql,
        [userId],
        (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message:
                        "Student profile not found."
                });
            }

            return res.json(
                results[0]
            );
        }
    );

    return;
}

// Lecturer, supervisor, or admin profile
const userSql = `
    SELECT
        id,
        full_name,
        email,
        role
    FROM users
    WHERE id = ?
`;

db.query(
    userSql,
    [userId],
    (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message:
                    "User not found."
            });
        }

        return res.json(
            results[0]
        );
    }
);


};
