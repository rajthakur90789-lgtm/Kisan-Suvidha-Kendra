
// Check Admin Access
const adminOnly = (req, res, next) => {
    try {
        // Check whether user is logged in
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login first."
            });
        }

        // Check whether user is Admin
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        // Allow Admin to continue
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Admin authorization failed"
        });
    }
};

module.exports = { adminOnly };
