const db = require("../config/db");

// Student submits a research topic
exports.createTopic = (req, res) => {

    const { topic_title, description } = req.body;
    const student_id = req.user.id;

    // Validate input
    if (!topic_title || !description) {
        return res.status(400).json({
            message: "Topic title and description are required."
        });
    }

    // Check how many topics the student has already submitted
    const checkSql = `
        SELECT COUNT(*) AS total
        FROM research_topics
        WHERE student_id = ?
    `;

    db.query(checkSql, [student_id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        // Allow a maximum of 3 topics
        if (results[0].total >= 3) {
            return res.status(400).json({
                message: "You can only submit a maximum of 3 research topics."
            });
        }

        // Insert the new topic
        const sql = `
            INSERT INTO research_topics
            (student_id, title, description)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [student_id, topic_title, description],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                res.status(201).json({
                    message: "Research topic submitted successfully."
                });
            }
        );

    });

};
// Get research topics
exports.getTopics = (req, res) => {

    console.log("Logged in user:", req.user);

    let sql = "";
    let params = [];

    // Students can only see their own topics
    if (req.user.role === "student") {

        sql = `
            SELECT
                id,
                title,
                description,
                status,
                lecturer_comment,
                supervisor_feedback,
                created_at
            FROM research_topics
            WHERE student_id = ?
            ORDER BY created_at DESC
        `;

        params = [req.user.id];

    } else {

        // Lecturers and Admins can see all topics
        sql = `
            SELECT
                research_topics.id,
                research_topics.title,
                research_topics.description,
                research_topics.status,
                research_topics.supervisor_id,
                research_topics.lecturer_comment,
                research_topics.supervisor_feedback,
                research_topics.created_at,

                students.full_name,
                students.email,

                supervisors.full_name AS supervisor_name

            FROM research_topics

            JOIN users AS students
                ON research_topics.student_id = students.id

            LEFT JOIN users AS supervisors
                ON research_topics.supervisor_id = supervisors.id

            ORDER BY research_topics.created_at DESC
        `;
    }

    console.log("SQL:", sql);
    console.log("Params:", params);

    db.query(sql, params, (err, results) => {

        if (err) {

            console.error("Database Error:", err);

            return res.status(500).json({
                error: err.message
            });

        }

        console.log("Topics returned:", results);

        res.status(200).json(results);

    });

};
// Lecturer approves or rejects a research topic

exports.updateTopicStatus = (req, res) => {

    const { id } = req.params;
const { status, supervisor_id, lecturer_comment } = req.body;
    // Validate status
    if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
            message: "Status must be either 'Approved' or 'Rejected'."
        });
    }

    // Get the student who owns this topic
    db.query(
        "SELECT student_id FROM research_topics WHERE id = ?",
        [id],
        (err, topicResult) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (topicResult.length === 0) {
                return res.status(404).json({
                    message: "Research topic not found."
                });
            }

            const student_id = topicResult[0].student_id;

            // If rejecting, simply reject the selected topic
            if (status === "Rejected") {

                db.query(
                    "UPDATE research_topics SET status = ? WHERE id = ?",
                    ["Rejected", id],
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                error: err.message
                            });
                        }

                        return res.status(200).json({
                            message: "Research topic rejected successfully."
                        });

                    }
                );

                return;
            }

            // Check whether the student already has an approved topic
            db.query(
                "SELECT id FROM research_topics WHERE student_id = ? AND status = 'Approved'",
                [student_id],
                (err, approvedResult) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    if (
                        approvedResult.length > 0 &&
                        approvedResult[0].id != id
                    ) {
                        return res.status(400).json({
                            message: "This student already has an approved topic."
                        });
                    }

                    // Approve the selected topic
                    db.query(
    `UPDATE research_topics
     SET status = 'Approved',
         supervisor_id = ?,
         lecturer_comment = ?
     WHERE id = ?`,
    [supervisor_id || null, lecturer_comment || null, id],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            // Reject all other topics belonging to this student
                            db.query(
                                "UPDATE research_topics SET status = 'Rejected' WHERE student_id = ? AND id <> ?",
                                [student_id, id],
                                (err) => {

                                    if (err) {
                                        return res.status(500).json({
                                            error: err.message
                                        });
                                    }

                                    res.status(200).json({
                                        message: "Topic approved and all other topics rejected successfully."
                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};
// Supervisor views assigned topics
// Supervisor views assigned topics
exports.getAssignedTopics = (req, res) => {

    const supervisor_id = req.user.id;

    const sql = `
        SELECT
            research_topics.id,
            research_topics.title,
            research_topics.description,
            research_topics.status,
            research_topics.created_at,

            students.full_name,
            students.email

        FROM research_topics

        JOIN users AS students
        ON research_topics.student_id = students.id

        WHERE research_topics.supervisor_id = ?

        ORDER BY research_topics.created_at DESC
    `;

    db.query(sql, [supervisor_id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(results);

    });

};
// Lecturer assigns a supervisor
exports.assignSupervisor = (req, res) => {

    const { id } = req.params;
    const { supervisor_id } = req.body;

    if (!supervisor_id) {
        return res.status(400).json({
            message: "Supervisor is required."
        });
    }

    const sql = `
        UPDATE research_topics
        SET supervisor_id = ?
        WHERE id = ?
    `;

    db.query(sql, [supervisor_id, id], (err) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json({
            message: "Supervisor assigned successfully."
        });

    });

};
// Student views assigned supervisor
exports.getAssignedSupervisor = (req, res) => {

    console.log("===== getAssignedSupervisor =====");
    console.log("Decoded User:", req.user);

    const sql = `
        SELECT
            research_topics.title,
            research_topics.status,
            users.full_name AS supervisor_name,
            users.email AS supervisor_email
        FROM research_topics
        LEFT JOIN users
            ON research_topics.supervisor_id = users.id
        WHERE research_topics.student_id = ?
        AND research_topics.status = 'Approved'
    `;

    db.query(sql, [req.user.id], (err, results) => {

        if (err) {
            console.log("SQL Error:", err);
            return res.status(500).json(err);
        }

        console.log("SQL Results:", results);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No supervisor assigned yet."
            });
        }

        res.json(results[0]);
    });
};
// Supervisor gives feedback
exports.giveFeedback = (req, res) => {

    const { id } = req.params;
    const { supervisor_feedback } = req.body;

    if (!supervisor_feedback) {
        return res.status(400).json({
            message: "Feedback is required."
        });
    }

    const sql = `
        UPDATE research_topics
        SET supervisor_feedback = ?
        WHERE id = ? AND supervisor_id = ?
    `;

    db.query(
        sql,
        [supervisor_feedback, id, req.user.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Topic not found or not assigned to you."
                });
            }

            res.status(200).json({
                message: "Feedback saved successfully."
            });

        }
    );

};