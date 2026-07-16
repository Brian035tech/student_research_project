const db = require("../config/db");
exports.getSupervisors = (req, res) => {

    const sql = `
        SELECT
            id,
            full_name
        FROM users
        WHERE role = 'supervisor'
        ORDER BY full_name
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);

    });

};