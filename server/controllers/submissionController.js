const db = require("../config/db");
const path = require("path");
// Student uploads final project
// Student uploads or resubmits final project
exports.uploadSubmission = (req, res) => {

    console.log("========== UPLOAD ==========");
    console.log("User:", req.user);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const student_id = req.user.id;
    const { topic_id } = req.body;

    // Check topic
    if (!topic_id) {

        return res.status(400).json({
            message: "Topic is required."
        });

    }

    // Check uploaded file
    if (!req.file) {

        return res.status(400).json({
            message: "Please upload a file."
        });

    }

    // Check that the topic is approved
    const topicSql = `
        SELECT id
        FROM research_topics
        WHERE id = ?
        AND student_id = ?
        AND status = 'Approved'
    `;

    db.query(
        topicSql,
        [topic_id, student_id],
        (topicError, topicResults) => {

            if (topicError) {

                return res.status(500).json({
                    error: topicError.message
                });

            }

            if (topicResults.length === 0) {

                return res.status(400).json({
                    message:
                        "Only approved research topics can be submitted."
                });

            }

            // Check whether the student already has a submission
            const submissionSql = `
                SELECT id, status
                FROM final_submissions
                WHERE student_id = ?
            `;

            db.query(
                submissionSql,
                [student_id],
                (submissionError, submissionResults) => {

                    if (submissionError) {

                        return res.status(500).json({
                            error: submissionError.message
                        });

                    }

                    // Student already has a submission
                    if (submissionResults.length > 0) {

                        const existingSubmission =
                            submissionResults[0];

                        // Only allow resubmission after revision is requested
                        if (
                            existingSubmission.status !==
                            "Revision Required"
                        ) {

                            return res.status(400).json({
                                message:
                                    "Your final project is already submitted and is awaiting review."
                            });

                        }

                        // Update the old record with the corrected file
                        const updateSql = `
    UPDATE final_submissions
    SET
        file_name = ?,
        submitted_at = CURRENT_TIMESTAMP,
        status = 'Pending Supervisor Review',
        supervisor_feedback = NULL,
        supervisor_reviewed_by = NULL
    WHERE id = ?
`;

                        db.query(
                            updateSql,
                            [
                                req.file.filename,
                                existingSubmission.id
                            ],
                            (updateError) => {

                                if (updateError) {

                                    return res.status(500).json({
                                        error:
                                            updateError.message
                                    });

                                }

                                return res.status(200).json({
                                    message:
                                        "Corrected final draft resubmitted successfully."
                                });

                            }
                        );

                        return;

                    }

                    // No previous submission: create a new record
                    const insertSql = `
                        INSERT INTO final_submissions
                        (
                            topic_id,
                            student_id,
                            file_name,
                            status
                        )
                        VALUES (?, ?, ?, ?, ?)
                    `;

                    db.query(
                        insertSql,
                        [
                            topic_id,
                            student_id,
                            req.file.filename,
                            "Pending Supervisor Review"
                        ],
                        (insertError) => {

                            if (insertError) {

                                return res.status(500).json({
                                    error:
                                        insertError.message
                                });

                            }

                            return res.status(201).json({
                                message:
                                    "Final project submitted successfully."
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

        res.json(results[0] || null);

    });

};

// Supervisor views final drafts waiting for review
exports.getSupervisorSubmissions = (req, res) => {

    const supervisor_id = req.user.id;

    const sql = `
        SELECT 
            fs.id,
            fs.file_name,
            fs.submitted_at,
            fs.status,
            fs.supervisor_feedback,
            u.full_name,
            rt.title
        FROM final_submissions fs
        JOIN users u
            ON fs.student_id = u.id
        JOIN research_topics rt
            ON fs.topic_id = rt.id
        WHERE rt.supervisor_id = ?
        AND fs.status = 'Pending Supervisor Review'
        ORDER BY fs.submitted_at DESC
    `;


    db.query(sql, [supervisor_id], (err, results)=>{

        if(err){
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);

    });

};

// Supervisor approves final draft
exports.approveFinalDraft = (req,res)=>{

    const submissionId = req.params.id;
    const supervisor_id = req.user.id;
    const {feedback} = req.body;


    const sql = `
        UPDATE final_submissions
        SET 
        status='Supervisor Approved',
        supervisor_feedback=?,
        supervisor_reviewed_by=?
        WHERE id=?
    `;


    db.query(
        sql,
        [
            feedback || "Final draft approved.",
            supervisor_id,
            submissionId
        ],
        err=>{

            if(err){
                return res.status(500).json({
                    error:err.message
                });
            }


            res.json({
                message:"Final draft approved by supervisor."
            });

        }
    );

};
exports.requestRevision = (req,res)=>{

    const submissionId = req.params.id;
    const supervisor_id = req.user.id;
    const {feedback} = req.body;


    const sql = `
        UPDATE final_submissions
        SET
        status='Revision Required',
        supervisor_feedback=?,
        supervisor_reviewed_by=?
        WHERE id=?
    `;


    db.query(
        sql,
        [
            feedback,
            supervisor_id,
            submissionId
        ],
        err=>{

            if(err){
                return res.status(500).json({
                    error:err.message
                });
            }


            res.json({
                message:"Revision requested."
            });

        }
    );

};

// Lecturer views final drafts approved by supervisors
exports.getLecturerSubmissions = (req, res) => {

    const sql = `
        SELECT
            fs.id,
            fs.topic_id,
            fs.student_id,
            fs.file_name,
            fs.submitted_at,
            fs.status,
            fs.supervisor_feedback,
            u.full_name AS student_name,
            rt.title AS topic_title
        FROM final_submissions fs
        JOIN users u
            ON fs.student_id = u.id
        JOIN research_topics rt
            ON fs.topic_id = rt.id
        WHERE fs.status = 'Supervisor Approved'
        ORDER BY fs.submitted_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(
                "Lecturer submissions error:",
                err
            );

            return res.status(500).json({
                message:
                    "Failed to load final drafts.",
                error: err.message
            });

        }

        res.json(results);

    });

};


// Lecturer approves the final draft
exports.approveByLecturer = (req, res) => {

    const submissionId = req.params.id;
    const lecturerId = req.user.id;

    const sql = `
        UPDATE final_submissions
        SET
            status = 'Lecturer Approved',
            lecturer_feedback = ?,
            lecturer_reviewed_by = ?
        WHERE id = ?
        AND status = 'Supervisor Approved'
    `;

    db.query(
        sql,
        [
            "Final research project approved by lecturer.",
            lecturerId,
            submissionId
        ],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message:
                        "Failed to approve final draft.",
                    error: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Final draft was not found or is not ready for lecturer review."
                });

            }

            res.json({
                message:
                    "Final draft approved successfully."
            });

        }
    );

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