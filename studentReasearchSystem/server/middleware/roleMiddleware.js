const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user is set by authMiddleware
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You do not have permission to access this resource."
            });
        }

        next();
    };
};

module.exports = authorizeRoles;