const db = require("../config/db");

// Supervisor adds feedback
exports.addFeedback = (req, res) => {

    const { topic_id, feedback } = req.body;

    const supervisor_id = req.user.id;

    if (!topic_id || !feedback) {
        return res.status(400).json({
            message: "Topic ID and feedback are required."
        });
    }

    const sql = `
        INSERT INTO research_feedback
        (topic_id, supervisor_id, feedback)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [topic_id, supervisor_id, feedback],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Feedback added successfully."
            });
        }
    );
};
// Student views feedback for their topics
exports.getFeedback = (req, res) => {

    const student_id = req.user.id;

    const sql = `
        SELECT
            research_feedback.id,
            research_topics.title,
            research_feedback.feedback,
            research_feedback.created_at
        FROM research_feedback
        INNER JOIN research_topics
        ON research_feedback.topic_id = research_topics.id
        WHERE research_topics.student_id = ?
        ORDER BY research_feedback.created_at DESC
    `;

    db.query(sql, [student_id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};