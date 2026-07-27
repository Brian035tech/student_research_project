const db = require("../config/db");
const path = require("path");
// Student uploads final project
exports.uploadSubmission = (req, res) => {

    console.log("========== UPLOAD ==========");
    console.log("User:", req.user);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const student_id = req.user.id;
    const { topic_id } = req.body;

    if (!topic_id) {
        return res.status(400).json({
            message: "Topic is required."
        });
    }

    if (!req.file) {
        return res.status(400).json({
            message: "Please upload a file."
        });
    }

    // ✅ Check if the topic is approved
    db.query(
        `SELECT id
         FROM research_topics
         WHERE id = ?
         AND student_id = ?
         AND status = 'Approved'`,
        [topic_id, student_id],
        (err, topic) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (topic.length === 0) {
                return res.status(400).json({
                    message: "Only approved research topics can be submitted."
                });
            }

            // ✅ Check if the student has already submitted
            db.query(
                "SELECT id FROM final_submissions WHERE student_id = ?",
                [student_id],
                (err, results) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    if (results.length > 0) {
                        return res.status(400).json({
                            message: "You have already submitted your final research."
                        });
                    }

                    // ✅ Save the submission
                    const sql = `
                        INSERT INTO final_submissions
                        (topic_id, student_id, file_name)
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        sql,
                        [topic_id, student_id, req.file.filename],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            res.status(201).json({
                                message: "Final project submitted successfully."
                            });

                        }
                    );

                }
            );

        }
    );

};
// Student views submitted project
exports.getSubmission = (req, res) => {

    const student_id = req.user.id;

    const sql = `
        SELECT *
        FROM final_submissions
        WHERE student_id = ?
        ORDER BY submitted_at DESC
        LIMIT 1
    `;

    db.query(sql, [student_id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);

    });

};
// Admin/Supervisor downloads a submitted file
exports.downloadSubmission = (req, res) => {
     console.log("Download requested by:", req.user);
    console.log("Submission ID:", req.params.id);


    const submissionId = req.params.id;

    const sql = `
        SELECT file_name
        FROM final_submissions
        WHERE id = ?
    `;

    db.query(sql, [submissionId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Submission not found."
            });
        }

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            results[0].file_name
        );

        console.log("File path:", filePath);
        res.download(filePath, (err) => {
            if (err) {
                return res.status(404).json({
                    message: "File not found."
                });
            }
        });

    });

};