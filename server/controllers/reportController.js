const db = require("../config/db");


// =====================================
// 1. RESEARCH TOPICS REPORT
// =====================================

exports.getTopicReport = (req, res) => {

    const sql = `

        SELECT

            COUNT(*) AS total_topics,

            SUM(
                status = 'Approved'
            ) AS approved_topics,

            SUM(
                status = 'Pending'
            ) AS pending_topics,

            SUM(
                status = 'Rejected'
            ) AS rejected_topics

        FROM research_topics

    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                return res
                    .status(500)
                    .json({

                        error:
                        err.message

                    });

            }


            res.status(200)
                .json(

                    results[0]

                );

        }

    );

};



// =====================================
// 2. STUDENT RESEARCH PROGRESS REPORT
// =====================================

exports.getStudentProgressReport = (
    req,
    res
) => {

    const sql = `

        SELECT

            u.full_name
            AS student_name,

            s.student_id,

            s.school,

            s.department,

            s.course,

            rt.title
            AS research_topic,

            rt.status
            AS topic_status,

            supervisor.full_name
            AS supervisor_name,

            fs.draft_stage,

            fs.status
            AS submission_status,

            fs.submitted_at

        FROM students s

        JOIN users u

            ON
            s.user_id = u.id

        LEFT JOIN
        research_topics rt

            ON
            rt.student_id = s.id

            AND
            rt.status = 'Approved'

        LEFT JOIN
        users supervisor

            ON
            rt.supervisor_id =
            supervisor.id

        LEFT JOIN
        final_submissions fs

            ON
            fs.topic_id = rt.id

        ORDER BY

            u.full_name ASC,

            fs.submitted_at ASC

    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                return res
                    .status(500)
                    .json({

                        error:
                        err.message

                    });

            }


            res.status(200)
                .json(

                    results

                );

        }

    );

};



// =====================================
// 3. FINAL SUBMISSION REPORT
// =====================================

exports.getFinalSubmissionReport = (
    req,
    res
) => {

    const sql = `

        SELECT

            fs.id,

            u.full_name
            AS student_name,

            s.student_id,

            rt.title
            AS research_topic,

            fs.file_name,

            fs.draft_stage,

            fs.status,

            fs.submitted_at,

            fs.supervisor_feedback,

            fs.lecturer_feedback,

            supervisor.full_name
            AS supervisor_name

        FROM
        final_submissions fs

        JOIN users u

            ON
            fs.student_id = u.id

        JOIN students s

            ON
            s.user_id = u.id

        JOIN research_topics rt

            ON
            fs.topic_id = rt.id

        LEFT JOIN
        users supervisor

            ON
            rt.supervisor_id =
            supervisor.id

        ORDER BY

            fs.submitted_at DESC

    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                return res
                    .status(500)
                    .json({

                        error:
                        err.message

                    });

            }


            res.status(200)
                .json(

                    results

                );

        }

    );

};