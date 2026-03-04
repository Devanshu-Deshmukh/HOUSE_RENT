const User = require("../models/User");
const { generateToken } = require("../middlewares/authMiddleware");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving users",
            error: error.message
        });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving user",
            error: error.message
        });
    }
};

// Register user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Validate input
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        const newUser = new User({
            name,
            email,
            password, // In production, use bcryptjs to hash this
            phone,
            role: role || "user"
        });

        const savedUser = await newUser.save();

        // Generate JWT Token
        const token = generateToken(savedUser);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Simple password check (in production, use bcryptjs)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT Token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating user",
            error: error.message
        });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await User.find({ role }).select("-password");
        res.status(200).json({
            success: true,
            message: `${role}s retrieved successfully`,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving users",
            error: error.message
        });
    }
};

// Get verified users only
exports.getVerifiedUsers = async (req, res) => {
    try {
        const users = await User.find({ isVerified: true }).select("-password");
        res.status(200).json({
            success: true,
            message: "Verified users retrieved",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving users",
            error: error.message
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check old password
        if (user.password !== oldPassword) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error changing password",
            error: error.message
        });
    }
};
