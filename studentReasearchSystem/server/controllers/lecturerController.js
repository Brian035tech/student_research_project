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