const db = require("../config/db");


exports.getDashboardStats = (req, res) => {

    const studentId = req.user.id;


    const stats = {};


    db.query(
        "SELECT COUNT(*) AS topics FROM research_topics WHERE student_id = ?",
        [studentId],
        (err, topics) => {

            if (err) {
                return res.status(500).json(err);
            }


            stats.topics = topics[0].topics;



            db.query(
                `
                SELECT users.full_name 
                FROM research_topics
                JOIN users
                ON research_topics.supervisor_id = users.id
                WHERE research_topics.student_id = ?
                LIMIT 1
                `,
                [studentId],

                (err, supervisor) => {


                    if (err) {
                        return res.status(500).json(err);
                    }


                    stats.supervisor =
                    supervisor.length > 0
                    ? supervisor[0].full_name
                    : "Not Assigned";



                    db.query(
                        `
                        SELECT COUNT(*) AS submissions
                        FROM submissions
                        WHERE student_id = ?
                        `,
                        [studentId],

                        (err, submissions) => {


                            if (err) {
                                return res.status(500).json(err);
                            }


                            stats.submissions =
                            submissions[0].submissions;


                            res.json(stats);


                        }
                    );


                }
            );


        }
    );

};