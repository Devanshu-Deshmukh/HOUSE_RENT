const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

// Verify JWT Token
exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};

// Verify Admin Role
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
            error: error.message
        });
    }
};

// Verify Owner Role
exports.isOwner = (req, res, next) => {
    try {
        if (req.user.role !== "owner" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Owner only."
            });
        }
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
            error: error.message
        });
    }
};

// Verify User Role
exports.isUser = (req, res, next) => {
    try {
        if (req.user.role !== "user" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. User role required."
            });
        }
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
            error: error.message
        });
    }
};

// Generate JWT Token (use in login)
exports.generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Optional: Verify Optional Token (doesn't fail if no token)
exports.verifyTokenOptional = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        next(); // Continue even if token is invalid
    }
};
