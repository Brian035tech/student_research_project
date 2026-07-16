const db = require("../config/db");


exports.getDashboardStats = (req, res) => {

    const supervisorId = req.user.id;

    const stats = {};


    // Assigned topics
    db.query(
        `
        SELECT COUNT(*) AS topics
        FROM research_topics
        WHERE supervisor_id = ?
        `,
        [supervisorId],

        (err, topics) => {

            if (err) return res.status(500).json(err);

            stats.topics = topics[0].topics;


            // Assigned students
            db.query(
                `
                SELECT COUNT(DISTINCT student_id) AS students
                FROM research_topics
                WHERE supervisor_id = ?
                `,
                [supervisorId],

                (err, students) => {

                    if (err) return res.status(500).json(err);

                    stats.students = students[0].students;


                    // Feedback given
                    db.query(
                        `
                        SELECT COUNT(*) AS feedback
                        FROM research_topics
                        WHERE supervisor_id = ?
                        AND supervisor_feedback IS NOT NULL
                        `,
                        [supervisorId],

                        (err, feedback) => {

                            if (err) return res.status(500).json(err);

                            stats.feedback = feedback[0].feedback;


                            res.json(stats);

                        }
                    );

                }
            );

        }
    );

};