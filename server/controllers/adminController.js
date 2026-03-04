const User = require("../models/User");
const House = require("../models/House");
const Booking = require("../models/Booking");

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            message: "All users retrieved",
            totalUsers: users.length,
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

// Get all properties (Admin only)
exports.getAllProperties = async (req, res) => {
    try {
        const properties = await House.find();
        res.status(200).json({
            success: true,
            message: "All properties retrieved",
            totalProperties: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving properties",
            error: error.message
        });
    }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("property");
        res.status(200).json({
            success: true,
            message: "All bookings retrieved",
            totalBookings: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving bookings",
            error: error.message
        });
    }
};

// Delete any user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

// Delete any property (Admin only)
exports.deleteProperty = async (req, res) => {
    try {
        const property = await House.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
            data: property
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting property",
            error: error.message
        });
    }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await House.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const availableProperties = await House.countDocuments({ isAvailable: true });
        const pendingBookings = await Booking.countDocuments({ status: "pending" });
        const totalRevenue = await Booking.aggregate([
            { $match: { status: "confirmed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.status(200).json({
            success: true,
            message: "Dashboard statistics retrieved",
            data: {
                totalUsers,
                totalProperties,
                availableProperties,
                totalBookings,
                pendingBookings,
                totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving statistics",
            error: error.message
        });
    }
};

// Verify user
exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying user",
            error: error.message
        });
    }
};

// Approve booking
exports.approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "confirmed" },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking approved successfully",
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error approving booking",
            error: error.message
        });
    }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking rejected successfully",
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error rejecting booking",
            error: error.message
        });
    }
};
