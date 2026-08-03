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

    // Count students
    db.query(
        "SELECT COUNT(*) AS students FROM users WHERE role = 'student'",
        (err, students) => {

            if (err) {
                console.log(err);

                return res.status(500).json(err);
            }

            stats.students = students[0].students;


           // Count available supervisors
db.query(
    `
    SELECT COUNT(*) AS supervisors
    FROM users
    WHERE role = 'supervisor'
    AND id NOT IN (
        SELECT supervisor_id
        FROM research_topics
        WHERE supervisor_id IS NOT NULL
    )
    `,
    (err, supervisors) => {

        if (err) {
            console.log("Supervisor count error:", err);

            return res.status(500).json(err);
        }

        stats.supervisors =
            supervisors[0].supervisors;



                    // Count all topics
                    db.query(
                        "SELECT COUNT(*) AS topics FROM research_topics",
                        (err, topics) => {

                            if (err) {
                                console.log(err);

                                return res.status(500).json(err);
                            }

                            stats.topics =
                                topics[0].topics;


                            // Count pending topics
                            db.query(
                                "SELECT COUNT(*) AS pending FROM research_topics WHERE status = 'Pending'",
                                (err, pending) => {

                                    if (err) {
                                        console.log(err);

                                        return res.status(500).json(err);
                                    }

                                    stats.pending =
                                        pending[0].pending;


                                    // Count approved topics
                                    db.query(
                                        "SELECT COUNT(*) AS approved FROM research_topics WHERE status = 'Approved'",
                                        (err, approved) => {

                                            if (err) {
                                                console.log(err);

                                                return res.status(500).json(err);
                                            }

                                            stats.approved =
                                                approved[0].approved;


                                            // Count rejected topics
                                            db.query(
                                                "SELECT COUNT(*) AS rejected FROM research_topics WHERE status = 'Rejected'",
                                                (err, rejected) => {

                                                    if (err) {
                                                        console.log(err);

                                                        return res.status(500).json(err);
                                                    }

                                                    stats.rejected =
                                                        rejected[0].rejected;


                                                    // Send all dashboard statistics
                                                    console.log(
                                                        "Lecturer dashboard stats:",
                                                        stats
                                                    );

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

};