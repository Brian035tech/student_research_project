const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
    const { full_name, email, password, role } = req.body;

    // Validate input
    if (!full_name || !email || !password || !role) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    try {
        // Check if email already exists
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                if (results.length > 0) {
                    return res.status(400).json({
                        message: "Email already registered."
                    });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user into database
                db.query(
                    "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
                    [full_name, email, hashedPassword, role],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                error: err.message
                            });
                        }

                        res.status(201).json({
                            message: "User registered successfully."
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
// Login User
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    // Find user by email
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            // User not found
            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            const user = results[0];

            // Compare entered password with hashed password

            console.log("Email entered:", email);
console.log("Password entered:", password);
console.log("Hash in DB:", user.password);

const isMatch = await bcrypt.compare(password, user.password);

console.log("Password Match:", isMatch);
            
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            // Generate JWT Token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            // Login successful
            res.status(200).json({
                message: "Login successful.",
                token: token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
};