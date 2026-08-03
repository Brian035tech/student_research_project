const db = require("../config/db");

// =====================================
// STUDENT UPLOADS OR REVISES CONCEPT PAPER
// =====================================

exports.uploadConceptPaper = (req, res) => {


const user_id = req.user.id;


if (!req.file) {

    return res.status(400).json({

        message:
            "Please select a concept paper."

    });

}


// Get student profile

const studentSql = `

    SELECT id

    FROM students

    WHERE user_id = ?

`;


db.query(

    studentSql,

    [user_id],

    (err, studentResult) => {

        if (err) {

            return res.status(500).json({

                error: err.message

            });

        }


        if (
            studentResult.length === 0
        ) {

            return res.status(404).json({

                message:
                    "Student profile not found."

            });

        }


        const student_id =
            studentResult[0].id;


        // Get approved research topic

        const topicSql = `

            SELECT id

            FROM research_topics

            WHERE student_id = ?

            AND status = 'Approved'

            LIMIT 1

        `;


        db.query(

            topicSql,

            [student_id],

            (err, topicResult) => {

                if (err) {

                    return res.status(500).json({

                        error: err.message

                    });

                }


                if (
                    topicResult.length === 0
                ) {

                    return res.status(400).json({

                        message:
                            "You must have an approved research topic before submitting a concept paper."

                    });

                }


                const topic_id =
                    topicResult[0].id;


                // Check whether a concept paper
                // already exists for this topic

                const checkSql = `

                    SELECT

                    id,

                    status

                    FROM concept_papers

                    WHERE student_id = ?

                    AND topic_id = ?

                    LIMIT 1

                `;


                db.query(

                    checkSql,

                    [
                        student_id,
                        topic_id
                    ],

                    (
                        err,
                        existingPaper
                    ) => {

                        if (err) {

                            return res
                            .status(500)
                            .json({

                                error:
                                    err.message

                            });

                        }


                        // =================================
                        // FIRST CONCEPT PAPER SUBMISSION
                        // =================================

                        if (
                            existingPaper.length === 0
                        ) {

                            const insertSql = `

                                INSERT INTO
                                concept_papers

                                (
                                    student_id,
                                    topic_id,
                                    file_name,
                                    status,
                                    supervisor_feedback
                                )

                                VALUES
                                (?, ?, ?, 'Pending', NULL)

                            `;


                            db.query(

                                insertSql,

                                [
                                    student_id,
                                    topic_id,
                                    req.file.filename
                                ],

                                (err) => {

                                    if (err) {

                                        return res
                                        .status(500)
                                        .json({

                                            error:
                                                err.message

                                        });

                                    }


                                    return res
                                    .status(201)
                                    .json({

                                        message:
                                            "Concept paper uploaded successfully and is awaiting supervisor review."

                                    });

                                }

                            );


                            return;

                        }


                        const paper =
                            existingPaper[0];


                        // =================================
                        // REVISED CONCEPT PAPER
                        // =================================

                        if (
                            paper.status ===
                            "Revision Required"
                        ) {

                            const updateSql = `

                                UPDATE
                                concept_papers

                                SET

                                file_name = ?,

                                status = 'Pending',

                                supervisor_feedback = NULL,

                                submitted_at =
                                CURRENT_TIMESTAMP

                                WHERE id = ?

                            `;


                            db.query(

                                updateSql,

                                [
                                    req.file.filename,
                                    paper.id
                                ],

                                (err) => {

                                    if (err) {

                                        return res
                                        .status(500)
                                        .json({

                                            error:
                                                err.message

                                        });

                                    }


                                    return res
                                    .status(200)
                                    .json({

                                        message:
                                            "Revised concept paper submitted successfully and is awaiting supervisor review."

                                    });

                                }

                            );


                            return;

                        }


                        // =================================
                        // BLOCK DUPLICATE SUBMISSIONS
                        // =================================

                        if (
                            paper.status ===
                            "Pending"
                        ) {

                            return res
                            .status(400)
                            .json({

                                message:
                                    "Your concept paper is already submitted and is awaiting supervisor review."

                            });

                        }


                        if (
                            paper.status ===
                            "Approved"
                        ) {

                            return res
                            .status(400)
                            .json({

                                message:
                                    "Your concept paper has already been approved. No further submission is required."

                            });

                        }


                        return res
                        .status(400)
                        .json({

                            message:
                                "You cannot submit another concept paper at this time."

                        });

                    }

                );

            }

        );

    }

);


};

// =====================================
// STUDENT VIEWS OWN CONCEPT PAPER
// =====================================

exports.getStudentConceptPaper = (
req,
res
) => {


const user_id =
    req.user.id;


const sql = `

    SELECT

    concept_papers.id,

    concept_papers.file_name,

    concept_papers.status,

    concept_papers.supervisor_feedback,

    concept_papers.submitted_at,


    research_topics.title,

    research_topics.description


    FROM concept_papers


    JOIN students

    ON concept_papers.student_id =
    students.id


    JOIN research_topics

    ON concept_papers.topic_id =
    research_topics.id


    WHERE students.user_id = ?


    ORDER BY
    concept_papers.submitted_at DESC


    LIMIT 1

`;


db.query(

    sql,

    [user_id],

    (err, results) => {

        if (err) {

            return res.status(500).json({

                error:
                    err.message

            });

        }


        if (
            results.length === 0
        ) {

            return res.status(404).json({

                message:
                    "No concept paper has been submitted yet."

            });

        }


        res.json(
            results[0]
        );

    }

);


};

// =====================================
// SUPERVISOR VIEWS ASSIGNED PAPERS
// =====================================

exports.getSupervisorConceptPapers = (
req,
res
) => {


const supervisor_id =
    req.user.id;


const sql = `

    SELECT

    concept_papers.id,

    concept_papers.file_name,

    concept_papers.status,

    concept_papers.supervisor_feedback,

    concept_papers.submitted_at,


    research_topics.title,

    research_topics.description,


    users.full_name,

    users.email,


    students.student_id,

    students.school,

    students.department,

    students.course


    FROM concept_papers


    JOIN research_topics

    ON concept_papers.topic_id =
    research_topics.id


    JOIN students

    ON concept_papers.student_id =
    students.id


    JOIN users

    ON students.user_id =
    users.id


    WHERE
    research_topics.supervisor_id = ?


    ORDER BY
    concept_papers.submitted_at DESC

`;


db.query(

    sql,

    [supervisor_id],

    (err, results) => {

        if (err) {

            return res.status(500).json({

                error:
                    err.message

            });

        }


        res.json(results);

    }

);


};

// =====================================
// SUPERVISOR REVIEWS CONCEPT PAPER
// =====================================

exports.reviewConceptPaper = (
req,
res
) => {


const { id } =
    req.params;


const {

    status,

    supervisor_feedback

} = req.body;


if (

    ![

        "Approved",

        "Revision Required"

    ].includes(status)

) {

    return res.status(400).json({

        message:
            "Status must be Approved or Revision Required."

    });

}


if (
    !supervisor_feedback
) {

    return res.status(400).json({

        message:
            "Supervisor feedback is required."

    });

}


const verifySql = `

    SELECT

    concept_papers.id


    FROM concept_papers


    JOIN research_topics

    ON concept_papers.topic_id =
    research_topics.id


    WHERE
    concept_papers.id = ?

    AND
    research_topics.supervisor_id = ?

`;


db.query(

    verifySql,

    [

        id,

        req.user.id

    ],

    (err, result) => {

        if (err) {

            return res.status(500).json({

                error:
                    err.message

            });

        }


        if (
            result.length === 0
        ) {

            return res.status(403).json({

                message:
                    "You are not authorized to review this concept paper."

            });

        }


        const updateSql = `

            UPDATE
            concept_papers

            SET

            status = ?,

            supervisor_feedback = ?

            WHERE id = ?

        `;


        db.query(

            updateSql,

            [

                status,

                supervisor_feedback,

                id

            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        error:
                            err.message

                    });

                }


                res.json({

                    message:
                        "Concept paper reviewed successfully."

                });

            }

        );

    }

);


};
