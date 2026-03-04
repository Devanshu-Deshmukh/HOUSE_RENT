const House = require("../models/House");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Get all properties owned by a specific owner
exports.getMyProperties = async (req, res) => {
    try {
        const { ownerEmail } = req.params;
        const properties = await House.find({ ownerEmail });
        res.status(200).json({
            success: true,
            message: "Owner properties retrieved",
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

// Add new property (Owner only)
exports.addProperty = async (req, res) => {
    try {
        const newProperty = new House(req.body);
        const savedProperty = await newProperty.save();

        // Add property to owner's propertiesOwned array
        await User.findOneAndUpdate(
            { email: req.body.ownerEmail },
            { $push: { propertiesOwned: savedProperty._id } }
        );

        res.status(201).json({
            success: true,
            message: "Property added successfully",
            data: savedProperty
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error adding property",
            error: error.message
        });
    }
};

// Update own property
exports.updateProperty = async (req, res) => {
    try {
        const property = await House.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Check if user is the owner
        if (property.ownerEmail !== req.body.ownerEmail) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own properties"
            });
        }

        const updatedProperty = await House.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
            data: updatedProperty
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating property",
            error: error.message
        });
    }
};

// Delete own property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await House.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Check if user is the owner
        if (property.ownerEmail !== req.body.ownerEmail) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own properties"
            });
        }

        const deletedProperty = await House.findByIdAndDelete(req.params.id);

        // Remove from owner's propertiesOwned
        await User.findOneAndUpdate(
            { email: req.body.ownerEmail },
            { $pull: { propertiesOwned: req.params.id } }
        );

        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
            data: deletedProperty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting property",
            error: error.message
        });
    }
};

// Get all bookings for owner's properties
exports.getMyBookings = async (req, res) => {
    try {
        const { ownerEmail } = req.params;
        const bookings = await Booking.find({ ownerEmail }).populate("property");
        res.status(200).json({
            success: true,
            message: "Owner bookings retrieved",
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

// Get booking details
exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("property");
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking details retrieved",
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving booking",
            error: error.message
        });
    }
};

// Update booking status (Owner can confirm/reject)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Check if user is the owner
        if (booking.ownerEmail !== req.body.ownerEmail) {
            return res.status(403).json({
                success: false,
                message: "You can only update bookings for your own properties"
            });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Booking status updated",
            data: updatedBooking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating booking status",
            error: error.message
        });
    }
};

// Get owner statistics
exports.getOwnerStats = async (req, res) => {
    try {
        const { ownerEmail } = req.params;
        
        const totalProperties = await House.countDocuments({ ownerEmail });
        const availableProperties = await House.countDocuments({ 
            ownerEmail, 
            isAvailable: true 
        });
        const totalBookings = await Booking.countDocuments({ ownerEmail });
        const confirmedBookings = await Booking.countDocuments({ 
            ownerEmail, 
            status: "confirmed" 
        });
        const pendingBookings = await Booking.countDocuments({ 
            ownerEmail, 
            status: "pending" 
        });
        const totalEarnings = await Booking.aggregate([
            { $match: { ownerEmail, status: "confirmed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.status(200).json({
            success: true,
            message: "Owner statistics retrieved",
            data: {
                totalProperties,
                availableProperties,
                rentedProperties: totalProperties - availableProperties,
                totalBookings,
                confirmedBookings,
                pendingBookings,
                totalEarnings: totalEarnings.length > 0 ? totalEarnings[0].total : 0
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

// Mark property as available
exports.markAvailable = async (req, res) => {
    try {
        const property = await House.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        const updatedProperty = await House.findByIdAndUpdate(
            req.params.id,
            { isAvailable: true, tenant: null, tenantEmail: null },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Property marked as available",
            data: updatedProperty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating property",
            error: error.message
        });
    }
};

// Get tenant inquiries
exports.getTenantInquiries = async (req, res) => {
    try {
        const { ownerEmail } = req.params;
        const inquiries = await Booking.find({ 
            ownerEmail, 
            status: "pending" 
        }).populate("property");

        res.status(200).json({
            success: true,
            message: "Tenant inquiries retrieved",
            totalInquiries: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving inquiries",
            error: error.message
        });
    }
};
