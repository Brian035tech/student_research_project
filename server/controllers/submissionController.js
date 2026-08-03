const db = require("../config/db");
const path = require("path");

// =====================================
// STUDENT UPLOADS OR RESUBMITS A DRAFT
// =====================================

exports.uploadSubmission = (req, res) => {


console.log(
    "========== DRAFT UPLOAD =========="
);

console.log(
    "User:",
    req.user
);

console.log(
    "Body:",
    req.body
);

console.log(
    "File:",
    req.file
);


const user_id =
    req.user.id;


const {
    topic_id,
    draft_stage
} = req.body;


const allowedStages = [

    "First Draft",

    "Second Draft",

    "Final Draft"

];


// Validate topic

if (!topic_id) {

    return res
    .status(400)
    .json({

        message:
            "Topic is required."

    });

}


// Validate draft stage

if (
    !allowedStages.includes(
        draft_stage
    )
) {

    return res
    .status(400)
    .json({

        message:
            "Invalid draft stage."

    });

}


// Validate file

if (!req.file) {

    return res
    .status(400)
    .json({

        message:
            "Please upload a file."

    });

}


// =====================================
// GET STUDENT PROFILE
// =====================================

const studentSql = `

    SELECT id

    FROM students

    WHERE user_id = ?

    LIMIT 1

`;


db.query(

    studentSql,

    [user_id],

    (
        studentError,
        studentResults
    ) => {

        if (
            studentError
        ) {

            return res
            .status(500)
            .json({

                error:
                    studentError
                    .message

            });

        }


        if (
            studentResults.length === 0
        ) {

            return res
            .status(404)
            .json({

                message:
                    "Student profile not found."

            });

        }


        const student_profile_id =

            studentResults[0]
            .id;


        // =================================
        // CHECK APPROVED TOPIC
        // =================================

        const topicSql = `

            SELECT id

            FROM research_topics

            WHERE id = ?

            AND student_id = ?

            AND status = 'Approved'

            LIMIT 1

        `;


        db.query(

            topicSql,

            [

                topic_id,

                student_profile_id

            ],

            (
                topicError,
                topicResults
            ) => {

                if (
                    topicError
                ) {

                    return res
                    .status(500)
                    .json({

                        error:
                            topicError
                            .message

                    });

                }


                if (
                    topicResults
                    .length === 0
                ) {

                    return res
                    .status(400)
                    .json({

                        message:

                        "Only approved research topics can be submitted."

                    });

                }


                // =============================
                // LOAD ALL STUDENT DRAFTS
                // =============================

                const draftsSql = `

                    SELECT

                        id,

                        draft_stage,

                        status

                    FROM
                    final_submissions

                    WHERE
                    student_id = ?

                    AND
                    topic_id = ?

                    ORDER BY
                    submitted_at ASC

                `;


                db.query(

                    draftsSql,

                    [

                        user_id,

                        topic_id

                    ],

                    (
                        draftsError,
                        drafts
                    ) => {

                        if (
                            draftsError
                        ) {

                            return res
                            .status(500)
                            .json({

                                error:

                                draftsError
                                .message

                            });

                        }


                        const firstDraft =

                            drafts.find(

                                (
                                    draft
                                ) =>

                                draft
                                .draft_stage ===

                                "First Draft"

                            );


                        const secondDraft =

                            drafts.find(

                                (
                                    draft
                                ) =>

                                draft
                                .draft_stage ===

                                "Second Draft"

                            );


                        const finalDraft =

                            drafts.find(

                                (
                                    draft
                                ) =>

                                draft
                                .draft_stage ===

                                "Final Draft"

                            );


                        // =========================
                        // CHECK STAGE ACCESS
                        // =========================

                        if (

                            draft_stage ===

                            "Second Draft"

                            &&

                            (

                                !firstDraft

                                ||

                                firstDraft
                                .status !==

                                "Supervisor Approved"

                            )

                        ) {

                            return res
                            .status(400)
                            .json({

                                message:

                                "Your First Draft must be approved before you can submit the Second Draft."

                            });

                        }


                        if (

                            draft_stage ===

                            "Final Draft"

                            &&

                            (

                                !secondDraft

                                ||

                                secondDraft
                                .status !==

                                "Supervisor Approved"

                            )

                        ) {

                            return res
                            .status(400)
                            .json({

                                message:

                                "Your Second Draft must be approved before you can submit the Final Draft."

                            });

                        }


                        // =========================
                        // FIND CURRENT STAGE
                        // =========================

                        const currentDraft =

                            drafts.find(

                                (
                                    draft
                                ) =>

                                draft
                                .draft_stage ===

                                draft_stage

                            );


                        // =========================
                        // RESUBMISSION
                        // =========================

                        if (
                            currentDraft
                        ) {

                            if (

                                currentDraft
                                .status !==

                                "Revision Required"

                            ) {

                                return res
                                .status(400)
                                .json({

                                    message:

                                    "This draft has already been submitted and is awaiting review or has been approved."

                                });

                            }


                            const updateSql = `

                                UPDATE
                                final_submissions

                                SET

                                file_name = ?,

                                submitted_at =
                                CURRENT_TIMESTAMP,

                                status =
                                'Pending Supervisor Review',

                                supervisor_feedback =
                                NULL,

                                supervisor_reviewed_by =
                                NULL,

                                lecturer_feedback =
                                NULL,

                                lecturer_reviewed_by =
                                NULL

                                WHERE id = ?

                            `;


                            return db.query(

                                updateSql,

                                [

                                    req.file
                                    .filename,

                                    currentDraft
                                    .id

                                ],

                                (
                                    updateError
                                ) => {

                                    if (
                                        updateError
                                    ) {

                                        return res
                                        .status(500)
                                        .json({

                                            error:

                                            updateError
                                            .message

                                        });

                                    }


                                    return res
                                    .status(200)
                                    .json({

                                        message:

                                        `Corrected ${draft_stage} submitted successfully and is awaiting supervisor review.`

                                    });

                                }

                            );

                        }


                        // =========================
                        // NEW DRAFT
                        // =========================

                        const insertSql = `

                            INSERT INTO
                            final_submissions

                            (

                                topic_id,

                                student_id,

                                file_name,

                                draft_stage,

                                status

                            )

                            VALUES

                            (

                                ?,

                                ?,

                                ?,

                                ?,

                                'Pending Supervisor Review'

                            )

                        `;


                        db.query(

                            insertSql,

                            [

                                topic_id,

                                user_id,

                                req.file
                                .filename,

                                draft_stage

                            ],

                            (
                                insertError
                            ) => {

                                if (
                                    insertError
                                ) {

                                    return res
                                    .status(500)
                                    .json({

                                        error:

                                        insertError
                                        .message

                                    });

                                }


                                return res
                                .status(201)
                                .json({

                                    message:

                                    `${draft_stage} submitted successfully and is awaiting supervisor review.`

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

// =====================================
// STUDENT VIEWS ALL DRAFTS
// =====================================

exports.getSubmission = (
req,
res
) => {


const student_id =
    req.user.id;


const sql = `

    SELECT *

    FROM
    final_submissions

    WHERE
    student_id = ?

    ORDER BY

    CASE draft_stage

        WHEN
        'First Draft'
        THEN 1

        WHEN
        'Second Draft'
        THEN 2

        WHEN
        'Final Draft'
        THEN 3

    END ASC

`;


db.query(

    sql,

    [student_id],

    (
        err,
        results
    ) => {

        if (
            err
        ) {

            return res
            .status(500)
            .json({

                error:
                    err.message

            });

        }


        // Return all draft records

        res.json(
            results
        );

    }

);


};

// =====================================
// SUPERVISOR VIEWS PENDING DRAFTS
// =====================================

exports.getSupervisorSubmissions = (
req,
res
) => {


const supervisor_id =
    req.user.id;


const sql = `

    SELECT

        fs.id,

        fs.file_name,

        fs.draft_stage,

        fs.submitted_at,

        fs.status,

        fs.supervisor_feedback,

        u.full_name,

        rt.title

    FROM
    final_submissions fs

    JOIN users u

        ON
        fs.student_id =
        u.id

    JOIN research_topics rt

        ON
        fs.topic_id =
        rt.id

    WHERE

        rt.supervisor_id = ?

    AND

        fs.status =

        'Pending Supervisor Review'

    ORDER BY

        fs.submitted_at DESC

`;


db.query(

    sql,

    [supervisor_id],

    (
        err,
        results
    ) => {

        if (
            err
        ) {

            return res
            .status(500)
            .json({

                error:
                    err.message

            });

        }


        res.json(
            results
        );

    }

);


};

// =====================================
// SUPERVISOR APPROVES A DRAFT
// =====================================

exports.approveFinalDraft = (
req,
res
) => {


const submissionId =
    req.params.id;


const supervisor_id =
    req.user.id;


const {
    feedback
} = req.body;


const sql = `

    UPDATE
    final_submissions

    SET

    status =
    'Supervisor Approved',

    supervisor_feedback = ?,

    supervisor_reviewed_by = ?

    WHERE id = ?

    AND status =

    'Pending Supervisor Review'

`;


db.query(

    sql,

    [

        feedback
        ?.trim()

        ||

        "Draft approved by supervisor.",

        supervisor_id,

        submissionId

    ],

    (
        err,
        result
    ) => {

        if (
            err
        ) {

            return res
            .status(500)
            .json({

                error:
                    err.message

            });

        }


        if (
            result
            .affectedRows === 0
        ) {

            return res
            .status(404)
            .json({

                message:

                "Draft was not found or is no longer awaiting review."

            });

        }


        res.json({

            message:

            "Draft approved by supervisor."

        });

    }

);


};

// =====================================
// SUPERVISOR REQUESTS REVISION
// =====================================

exports.requestRevision = (
req,
res
) => {


const submissionId =
    req.params.id;


const supervisor_id =
    req.user.id;


const {
    feedback
} = req.body;


// Feedback is compulsory
// for a revision request

if (

    !feedback

    ||

    !feedback.trim()

) {

    return res
    .status(400)
    .json({

        message:

        "Supervisor feedback is required when requesting a revision."

    });

}


const sql = `

    UPDATE
    final_submissions

    SET

    status =
    'Revision Required',

    supervisor_feedback = ?,

    supervisor_reviewed_by = ?

    WHERE id = ?

    AND status =

    'Pending Supervisor Review'

`;


db.query(

    sql,

    [

        feedback.trim(),

        supervisor_id,

        submissionId

    ],

    (
        err,
        result
    ) => {

        if (
            err
        ) {

            return res
            .status(500)
            .json({

                error:
                    err.message

            });

        }


        if (
            result
            .affectedRows === 0
        ) {

            return res
            .status(404)
            .json({

                message:

                "Draft was not found or is no longer awaiting review."

            });

        }


        res.json({

            message:

            "Revision requested successfully."

        });

    }

);


};

// =====================================
// LECTURER VIEWS ONLY FINAL DRAFTS
// =====================================

exports.getLecturerSubmissions = (
req,
res
) => {


const sql = `

    SELECT

        fs.id,

        fs.topic_id,

        fs.student_id,

        fs.file_name,

        fs.draft_stage,

        fs.submitted_at,

        fs.status,

        fs.supervisor_feedback,

        u.full_name
        AS student_name,

        rt.title
        AS topic_title

    FROM
    final_submissions fs

    JOIN users u

        ON
        fs.student_id =
        u.id

    JOIN research_topics rt

        ON
        fs.topic_id =
        rt.id

    WHERE

        fs.status =

        'Supervisor Approved'

    AND

        fs.draft_stage =

        'Final Draft'

    ORDER BY

        fs.submitted_at DESC

`;


db.query(

    sql,

    (
        err,
        results
    ) => {

        if (
            err
        ) {

            return res
            .status(500)
            .json({

                message:

                "Failed to load final drafts.",

                error:
                    err.message

            });

        }


        res.json(
            results
        );

    }

);


};

// =====================================
// LECTURER APPROVES FINAL DRAFT
// =====================================

exports.approveByLecturer = (
req,
res
) => {


const submissionId =
    req.params.id;


const lecturerId =
    req.user.id;


const sql = `

    UPDATE
    final_submissions

    SET

    status =

    'Lecturer Approved',

    lecturer_feedback = ?,

    lecturer_reviewed_by = ?

    WHERE id = ?

    AND status =

    'Supervisor Approved'

    AND draft_stage =

    'Final Draft'

`;


db.query(

    sql,

    [

        "Final research project approved by lecturer.",

        lecturerId,

        submissionId

    ],

    (
        err,
        result
    ) => {

        if (
            err
        ) {

            return res
            .status(500)
            .json({

                message:

                "Failed to approve final draft.",

                error:
                    err.message

            });

        }


        if (
            result
            .affectedRows === 0
        ) {

            return res
            .status(404)
            .json({

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

// =====================================
// DOWNLOAD SUBMITTED FILE
// =====================================

exports.downloadSubmission = (
req,
res
) => {


console.log(
    "Download requested by:",
    req.user
);


console.log(
    "Submission ID:",
    req.params.id
);


const submissionId =
    req.params.id;


const sql = `

    SELECT
    file_name

    FROM
    final_submissions

    WHERE id = ?

`;


db.query(

    sql,

    [submissionId],

    (
        err,
        results
    ) => {

        if (
            err
        ) {

            return res
            .status(500)
            .json({

                error:
                    err.message

            });

        }


        if (
            results.length === 0
        ) {

            return res
            .status(404)
            .json({

                message:

                "Submission not found."

            });

        }


        const filePath =
            path.join(

                __dirname,

                "..",

                "uploads",

                results[0]
                .file_name

            );


        console.log(
            "File path:",
            filePath
        );


        res.download(

            filePath,

            (
                downloadError
            ) => {

                if (
                    downloadError
                ) {

                    if (
                        !res.headersSent
                    ) {

                        return res
                        .status(404)
                        .json({

                            message:

                            "File not found."

                        });

                    }

                }

            }

        );

    }

);


};
