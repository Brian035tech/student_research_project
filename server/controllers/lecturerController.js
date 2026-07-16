const db = require("../config/db");

// Get all research topics
exports.getAllTopics = (req, res) => {

    const sql = `
        SELECT
            research_topics.id,
            research_topics.title,
            research_topics.description,
            research_topics.status,
            research_topics.lecturer_comment,
            research_topics.created_at,
            users.full_name
        FROM research_topics
        JOIN users
        ON research_topics.student_id = users.id
        ORDER BY research_topics.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server error"
            });
        }

        res.json(results);

    });

};


// Approve or Reject topic
exports.reviewTopic = (req, res) => {

    const { id } = req.params;

    const { status, lecturer_comment } = req.body;

    const sql = `
        UPDATE research_topics
        SET
        status = ?,
        lecturer_comment = ?
        WHERE id = ?
    `;

    db.query(sql, [status, lecturer_comment, id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server error"
            });
        }

        res.json({
            message: "Topic updated successfully"
        });

    });

};
exports.getDashboardStats = (req, res) => {

    const stats = {};


    db.query(
        "SELECT COUNT(*) AS students FROM users WHERE role='student'",
        (err, students) => {

            if (err) return res.status(500).json(err);

            stats.students = students[0].students;


            db.query(
                "SELECT COUNT(*) AS topics FROM research_topics",
                (err, topics) => {

                    if (err) return res.status(500).json(err);

                    stats.topics = topics[0].topics;


                    db.query(
                        "SELECT COUNT(*) AS pending FROM research_topics WHERE status='Pending'",
                        (err, pending) => {

                            if (err) return res.status(500).json(err);

                            stats.pending = pending[0].pending;


                            db.query(
                                "SELECT COUNT(*) AS approved FROM research_topics WHERE status='Approved'",
                                (err, approved) => {

                                    if (err) return res.status(500).json(err);

                                    stats.approved = approved[0].approved;


                                    db.query(
                                        "SELECT COUNT(*) AS rejected FROM research_topics WHERE status='Rejected'",
                                        (err, rejected) => {

                                            if (err) return res.status(500).json(err);

                                            stats.rejected = rejected[0].rejected;


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

};