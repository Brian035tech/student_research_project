const db = require("../config/db");

// Get all supervisors
exports.getSupervisors = (req, res) => {

    const sql = `
        SELECT id, full_name
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

// Get logged-in user's profile
exports.getProfile = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT id, full_name, email, role
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: err.message
            });
        }

        console.log("Database Result:", results);

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(results[0]);
    });
};