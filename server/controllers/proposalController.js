const db = require("../config/db");

// Student uploads a proposal
exports.uploadProposal = (req, res) => {
    const student_id = req.user.id;
    const { topic_id } = req.body;

    // Validate topic
    if (!topic_id) {
        return res.status(400).json({
            message: "Topic is required."
        });
    }

    // Validate file
    if (!req.file) {
        return res.status(400).json({
            message: "Please upload a proposal file."
        });
    }

    // Check that the topic belongs to the student,
    // is approved, and has a supervisor assigned
    const topicSql = `
        SELECT id
        FROM research_topics
        WHERE id = ?
        AND student_id = ?
        AND status = 'Approved'
        AND supervisor_id IS NOT NULL
    `;

    db.query(
        topicSql,
        [topic_id, student_id],
        (err, topics) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (topics.length === 0) {
                return res.status(400).json({
                    message:
                        "You can only submit a proposal for an approved topic with an assigned supervisor."
                });
            }

            // Check whether the student already has a proposal
            db.query(
                `SELECT id, review_status
                 FROM proposal_submissions
                 WHERE student_id = ?`,
                [student_id],
                (err, proposals) => {
                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    // No proposal exists: create a new one
                    if (proposals.length === 0) {
                        const insertSql = `
                            INSERT INTO proposal_submissions
                            (
                                topic_id,
                                student_id,
                                file_name,
                                review_status
                            )
                            VALUES (?, ?, ?, 'Pending')
                        `;

                        return db.query(
                            insertSql,
                            [
                                topic_id,
                                student_id,
                                req.file.filename
                            ],
                            (err) => {
                                if (err) {
                                    return res.status(500).json({
                                        error: err.message
                                    });
                                }

                                return res.status(201).json({
                                    message:
                                        "Proposal submitted successfully and is awaiting supervisor review."
                                });
                            }
                        );
                    }

                    const proposal = proposals[0];

                    // Do not allow replacement while pending
                    if (proposal.review_status === "Pending") {
                        return res.status(400).json({
                            message:
                                "Your proposal is still awaiting supervisor review."
                        });
                    }

                    // Do not allow replacement after approval
                    if (proposal.review_status === "Approved") {
                        return res.status(400).json({
                            message:
                                "Your proposal has already been approved."
                        });
                    }

                    // Allow replacement only when revisions are required
                    const updateSql = `
                        UPDATE proposal_submissions
                        SET
                            topic_id = ?,
                            file_name = ?,
                            review_status = 'Pending',
                            supervisor_feedback = NULL,
                            submitted_at = CURRENT_TIMESTAMP
                        WHERE student_id = ?
                    `;

                    db.query(
                        updateSql,
                        [
                            topic_id,
                            req.file.filename,
                            student_id
                        ],
                        (err) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            return res.status(200).json({
                                message:
                                    "Revised proposal submitted and is awaiting supervisor review."
                            });
                        }
                    );
                }
            );
        }
    );
};


// Supervisor views proposals submitted by assigned students
exports.getAssignedProposals = (req, res) => {

    const supervisor_id = req.user.id;

    const sql = `
        SELECT
            proposal_submissions.id,
            proposal_submissions.topic_id,
            proposal_submissions.student_id,
            proposal_submissions.file_name,
            proposal_submissions.review_status,
            proposal_submissions.supervisor_feedback,
            proposal_submissions.submitted_at,

            research_topics.title,

            users.full_name AS student_name,
            users.email AS student_email

        FROM proposal_submissions

        JOIN research_topics
            ON proposal_submissions.topic_id = research_topics.id

        JOIN users
            ON proposal_submissions.student_id = users.id

        WHERE research_topics.supervisor_id = ?

        ORDER BY proposal_submissions.submitted_at DESC
    `;

    db.query(
        sql,
        [supervisor_id],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.status(200).json(results);

        }
    );

};

// Supervisor approves a proposal or requests revisions
exports.reviewProposal = (req, res) => {

    const { proposal_id, review_status, supervisor_feedback } = req.body;

    const supervisor_id = req.user.id;

    // Validate input
    if (!proposal_id || !review_status) {

        return res.status(400).json({
            message: "Proposal ID and review status are required."
        });

    }

    // Only allow valid review statuses
    const allowedStatuses = [
        "Approved",
        "Revision Required"
    ];

    if (!allowedStatuses.includes(review_status)) {

        return res.status(400).json({
            message: "Invalid review status."
        });

    }

    // Check that the proposal belongs to a student assigned
    // to the logged-in supervisor
    const checkSql = `
        SELECT proposal_submissions.id

        FROM proposal_submissions

        JOIN research_topics
            ON proposal_submissions.topic_id = research_topics.id

        WHERE proposal_submissions.id = ?
        AND research_topics.supervisor_id = ?
    `;

    db.query(
        checkSql,
        [proposal_id, supervisor_id],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(403).json({
                    message:
                        "You are not authorized to review this proposal."
                });

            }

            // Update proposal status and feedback
            const updateSql = `
                UPDATE proposal_submissions

                SET
                    review_status = ?,
                    supervisor_feedback = ?

                WHERE id = ?
            `;

            db.query(
                updateSql,
                [
                    review_status,
                    supervisor_feedback || null,
                    proposal_id
                ],
                (err) => {

                    if (err) {

                        return res.status(500).json({
                            error: err.message
                        });

                    }

                    res.status(200).json({
                        message:
                            review_status === "Approved"
                                ? "Proposal approved successfully."
                                : "Proposal sent back for revision."
                    });

                }
            );

        }
    );

};

// Student views their submitted proposal
exports.getMyProposal = (req, res) => {

    const student_id = req.user.id;

    const sql = `
        SELECT
            proposal_submissions.id,
            proposal_submissions.topic_id,
            proposal_submissions.student_id,
            proposal_submissions.file_name,
            proposal_submissions.review_status,
            proposal_submissions.supervisor_feedback,
            proposal_submissions.submitted_at,

            research_topics.title

        FROM proposal_submissions

        JOIN research_topics
            ON proposal_submissions.topic_id =
               research_topics.id

        WHERE proposal_submissions.student_id = ?

        ORDER BY proposal_submissions.submitted_at DESC

        LIMIT 1
    `;

    db.query(
        sql,
        [student_id],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(200).json(null);

            }

            res.status(200).json(results[0]);

        }
    );

};