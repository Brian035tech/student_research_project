const db = require("../config/db");

exports.getDashboardStats = (req, res) => {

    const user_id = req.user.id;

    const stats = {};

    // 1. Get student profile information
    const studentSql = `
        SELECT
            students.id,
            users.full_name AS student_name,
            students.student_id,
            students.school,
            students.department,
            students.course
        FROM students

        JOIN users
        ON students.user_id = users.id

        WHERE students.user_id = ?
    `;

    db.query(
        studentSql,
        [user_id],
        (err, studentResult) => {

            if (err) {
                console.error("Student profile error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (studentResult.length === 0) {
                return res.status(404).json({
                    message: "Student profile not found."
                });
            }

            // Save student information
            const student = studentResult[0];

            stats.student_name = student.student_name;
            stats.student_id = student.student_id;
            stats.school = student.school;
            stats.department = student.department;
            stats.course = student.course;

            // Internal ID from students table
            const student_id = student.id;


            // 2. Count submitted topics
            const topicsSql = `
                SELECT COUNT(*) AS topics
                FROM research_topics
                WHERE student_id = ?
            `;

            db.query(
                topicsSql,
                [student_id],
                (err, topicsResult) => {

                    if (err) {
                        console.error("Topics error:", err);

                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    stats.topics =
                        topicsResult[0].topics;


                    // 3. Get assigned supervisor
                    const supervisorSql = `
                        SELECT
                            users.full_name
                        FROM research_topics

                        JOIN users
                        ON research_topics.supervisor_id =
                           users.id

                        WHERE research_topics.student_id = ?
                        AND research_topics.status = 'Approved'

                        LIMIT 1
                    `;

                    db.query(
                        supervisorSql,
                        [student_id],
                        (err, supervisorResult) => {

                            if (err) {
                                console.error(
                                    "Supervisor error:",
                                    err
                                );

                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            stats.supervisor =
                                supervisorResult.length > 0
                                    ? supervisorResult[0].full_name
                                    : "Not Assigned";


                           // 4. Calculate research progress

const progressSql = `
    SELECT
        draft_stage,
        status
    FROM final_submissions
    WHERE student_id = ?
`;

db.query(
    progressSql,
    [user_id],
    (err, drafts) => {

        if (err) {
            console.error(
                "Progress error:",
                err
            );

            return res.status(500).json({
                error: err.message
            });
        }


        let progress = 20;


        // Supervisor assigned
        if (
            stats.supervisor !== "Not Assigned"
        ) {
            progress = 30;
        }


        const firstDraft =
            drafts.find(
                d =>
                d.draft_stage === "First Draft"
            );


        const secondDraft =
            drafts.find(
                d =>
                d.draft_stage === "Second Draft"
            );


        const finalDraft =
            drafts.find(
                d =>
                d.draft_stage === "Final Draft"
            );


        if (firstDraft) {
            progress = 45;
        }


        if (
            firstDraft &&
            firstDraft.status ===
            "Supervisor Approved"
        ) {
            progress = 55;
        }


        if (secondDraft) {
            progress = 70;
        }


        if (
            secondDraft &&
            secondDraft.status ===
            "Supervisor Approved"
        ) {
            progress = 80;
        }


        if (finalDraft) {
            progress = 90;
        }


        if (
            finalDraft &&
            finalDraft.status ===
            "Lecturer Approved"
        ) {
            progress = 100;
        }


        stats.progress = progress;

        stats.submissions =
            drafts.length;


        console.log(
            "Dashboard stats:",
            stats
        );


        res.status(200).json(stats);

    }
);

                        }
                    );

                }
            );

        }
    );

};
// Get logged-in student profile
exports.getStudentProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            u.full_name,
            u.email,
            u.role,
            s.student_id,
            s.school,
            s.department,
            s.course
        FROM students s
        JOIN users u
            ON s.user_id = u.id
        WHERE u.id = ?
    `;


    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }


        if (results.length === 0) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }


        res.json(results[0]);

    });

};