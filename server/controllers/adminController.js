const db = require("../config/db");

/* ===========================
   Dashboard Statistics
=========================== */

exports.getDashboardStats = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS totalStudents FROM users WHERE role='student'",
        (err, students) => {

            if (err) return res.status(500).json(err);

            stats.students = students[0].totalStudents;

            db.query(
                "SELECT COUNT(*) AS totalLecturers FROM users WHERE role='lecturer'",
                (err, lecturers) => {

                    if (err) return res.status(500).json(err);

                    stats.lecturers = lecturers[0].totalLecturers;

                    db.query(
                        "SELECT COUNT(*) AS totalSupervisors FROM users WHERE role='supervisor'",
                        (err, supervisors) => {

                            if (err) return res.status(500).json(err);

                            stats.supervisors = supervisors[0].totalSupervisors;

                            db.query(
                                "SELECT COUNT(*) AS totalTopics FROM research_topics",
                                (err, topics) => {

                                    if (err) return res.status(500).json(err);

                                    stats.topics = topics[0].totalTopics;

                                    db.query(
                                        "SELECT COUNT(*) AS approved FROM research_topics WHERE status='Approved'",
                                        (err, approved) => {

                                            if (err) return res.status(500).json(err);

                                            stats.approved = approved[0].approved;

                                            db.query(
                                                "SELECT COUNT(*) AS pending FROM research_topics WHERE status='Pending'",
                                                (err, pending) => {

                                                    if (err) return res.status(500).json(err);

                                                    stats.pending = pending[0].pending;

                                                    db.query(
                                                        "SELECT COUNT(*) AS rejected FROM research_topics WHERE status='Rejected'",
                                                        (err, rejected) => {

                                                            if (err) return res.status(500).json(err);

                                                            stats.rejected = rejected[0].rejected;

                                                           db.query(
    "SELECT COUNT(*) AS submissions FROM final_submissions",
    (err, submissions) => {

        if (err) return res.status(500).json(err);

        stats.submissions = submissions[0].submissions;

        res.json(stats);

    }
);

                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

/* ===========================
   Get All Users
=========================== */

exports.getAllUsers = (req, res) => {

    db.query(
        "SELECT id, full_name, email, role FROM users ORDER BY id DESC",
        (err, results) => {

            if (err) return res.status(500).json(err);

            res.json(results);

        }
    );

};

/* ===========================
   Delete User
=========================== */

exports.deleteUser = (req, res) => {

    db.query(
        "DELETE FROM users WHERE id = ?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "User deleted successfully"
            });

        }
    );

};

/* ===========================
   Get All Research Topics
=========================== */

exports.getAllTopics = (req, res) => {

    const sql = `
        SELECT
            research_topics.id,
            research_topics.title,
            research_topics.status,
            users.full_name AS student
        FROM research_topics
        JOIN users
        ON research_topics.student_id = users.id
        ORDER BY research_topics.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) return res.status(500).json(err);

        res.json(results);

    });

};

/* ===========================
   Get Final Submissions
=========================== */

exports.getFinalSubmissions = (req, res) => {

    const sql = `
        SELECT
            fs.id,
            fs.file_name,
            fs.submitted_at,
            u.full_name
        FROM final_submissions fs
        JOIN users u
            ON fs.student_id = u.id
        ORDER BY fs.submitted_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        const submissions = results.map(item => ({
            ...item,
            download_url: `http://localhost:5000/uploads/${item.file_name}`
        }));

        res.json(submissions);

    });

};

/* ===========================
   Admin Profile
=========================== */

exports.getProfile = (req, res) => {

    db.query(
        "SELECT id, full_name, email, role FROM users WHERE id = ?",
        [req.user.id],
        (err, results) => {

            if (err) return res.status(500).json(err);

            res.json(results[0]);

        }
    );

};

/* ===========================
   Download System Report
=========================== */

exports.downloadReport = (req, res) => {

    const report = {};

    db.query(
        "SELECT COUNT(*) AS students FROM users WHERE role='student'",
        (err, students) => {

            if (err) return res.status(500).json(err);

            report.students = students[0].students;

            db.query(
                "SELECT COUNT(*) AS lecturers FROM users WHERE role='lecturer'",
                (err, lecturers) => {

                    if (err) return res.status(500).json(err);

                    report.lecturers = lecturers[0].lecturers;

                    db.query(
                        "SELECT COUNT(*) AS supervisors FROM users WHERE role='supervisor'",
                        (err, supervisors) => {

                            if (err) return res.status(500).json(err);

                            report.supervisors = supervisors[0].supervisors;

                            db.query(
                                "SELECT COUNT(*) AS topics FROM research_topics",
                                (err, topics) => {

                                    if (err) return res.status(500).json(err);

                                    report.topics = topics[0].topics;

                                    db.query(
                                        "SELECT COUNT(*) AS approved FROM research_topics WHERE status='Approved'",
                                        (err, approved) => {

                                            if (err) return res.status(500).json(err);

                                            report.approved = approved[0].approved;

                                            db.query(
                                                "SELECT COUNT(*) AS pending FROM research_topics WHERE status='Pending'",
                                                (err, pending) => {

                                                    if (err) return res.status(500).json(err);

                                                    report.pending = pending[0].pending;

                                                    db.query(
                                                        "SELECT COUNT(*) AS rejected FROM research_topics WHERE status='Rejected'",
                                                        (err, rejected) => {

                                                            if (err) return res.status(500).json(err);

                                                            report.rejected = rejected[0].rejected;

                                                            db.query(
                                                                "SELECT COUNT(*) AS submissions FROM final_submissions",
                                                                (err, submissions) => {

                                                                    if (err) return res.status(500).json(err);

                                                                    report.submissions = submissions[0].submissions;

                                                                    const content = `
==================================================
 STUDENT RESEARCH MANAGEMENT SYSTEM REPORT
==================================================

Students             : ${report.students}
Lecturers            : ${report.lecturers}
Supervisors          : ${report.supervisors}

Total Topics         : ${report.topics}
Approved Topics      : ${report.approved}
Pending Topics       : ${report.pending}
Rejected Topics      : ${report.rejected}

Final Submissions    : ${report.submissions}

Generated On:
${new Date().toLocaleString()}

==================================================
`;

                                                                    res.setHeader(
                                                                        "Content-Disposition",
                                                                        "attachment; filename=SRMS_Report.txt"
                                                                    );

                                                                    res.setHeader(
                                                                        "Content-Type",
                                                                        "text/plain"
                                                                    );

                                                                    res.send(content);

                                                                }
                                                            );

                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

exports.getRecentActivity = (req, res) => {

    const sql = `
        SELECT
            u.full_name,
            rt.title,
            rt.status,
            rt.created_at
        FROM research_topics rt
        JOIN users u
            ON rt.student_id = u.id
        ORDER BY rt.created_at DESC
        LIMIT 5
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};