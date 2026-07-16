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
                                                                "SELECT COUNT(*) AS submissions FROM submissions",
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
            submissions.id,
            submissions.file_name,
            submissions.file_path,
            submissions.submitted_at,
            users.full_name
        FROM submissions
        JOIN users
        ON submissions.student_id = users.id
        ORDER BY submissions.submitted_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) return res.status(500).json(err);

        res.json(results);

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