const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    // Check that the header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid token format."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        console.log(error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = verifyToken;