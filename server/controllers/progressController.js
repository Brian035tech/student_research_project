const db = require("../config/db");

// Student submits progress
exports.addProgress = (req, res) => {

    const { topic_id, progress } = req.body;

    const student_id = req.user.id;

    if (!topic_id || !progress) {
        return res.status(400).json({
            message: "Topic ID and progress are required."
        });
    }

    const sql = `
        INSERT INTO research_progress
        (topic_id, student_id, progress)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [topic_id, student_id, progress],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Progress submitted successfully."
            });
        }
    );
};
// Supervisor views student progress
exports.getAssignedProgress = (req, res) => {

    const supervisor_id = req.user.id;

    const sql = `
        SELECT
            research_progress.id,
            research_topics.title,
            research_progress.progress,
            research_progress.status,
            research_progress.created_at
        FROM research_progress
        INNER JOIN research_topics
        ON research_progress.topic_id = research_topics.id
        WHERE research_topics.supervisor_id = ?
        ORDER BY research_progress.created_at DESC
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
// Supervisor reviews student progress
exports.updateProgressStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!["Reviewed", "Completed"].includes(status)) {
        return res.status(400).json({
            message: "Invalid progress status."
        });
    }

    const sql = `
        UPDATE research_progress
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Progress record not found."
            });
        }

        res.status(200).json({
            message: "Progress status updated successfully."
        });
    });
};