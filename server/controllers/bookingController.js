const Booking = require("../models/Booking");
const House = require("../models/House");

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("property");
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
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

// Get booking by ID
exports.getBookingById = async (req, res) => {
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
            message: "Booking retrieved successfully",
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

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const { tenant, tenantEmail, tenantPhone, property, bookingStartDate, bookingEndDate, rentAmount } = req.body;

        // Check if house exists
        const house = await House.findById(property);
        if (!house) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Calculate number of months
        const startDate = new Date(bookingStartDate);
        const endDate = new Date(bookingEndDate);
        const numberOfMonths = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
        const totalAmount = rentAmount * numberOfMonths;

        const newBooking = new Booking({
            tenant,
            tenantEmail,
            tenantPhone,
            property,
            owner: house.owner,
            ownerEmail: house.ownerEmail,
            bookingStartDate,
            bookingEndDate,
            rentAmount,
            numberOfMonths,
            totalAmount
        });

        const savedBooking = await newBooking.save();

        // Update house to mark tenant
        await House.findByIdAndUpdate(property, {
            tenant,
            tenantEmail,
            isAvailable: false
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: savedBooking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating booking",
            error: error.message
        });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
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
            message: "Booking status updated",
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating booking",
            error: error.message
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "rejected", updatedAt: Date.now() },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Mark house as available again
        await House.findByIdAndUpdate(booking.property, {
            tenant: null,
            tenantEmail: null,
            isAvailable: true
        });

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            error: error.message
        });
    }
};

// Get bookings by tenant
exports.getBookingsByTenant = async (req, res) => {
    try {
        const { tenantEmail } = req.params;
        const bookings = await Booking.find({ tenantEmail }).populate("property");
        res.status(200).json({
            success: true,
            message: "Tenant bookings retrieved",
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

// Get bookings by owner
exports.getBookingsByOwner = async (req, res) => {
    try {
        const { ownerEmail } = req.params;
        const bookings = await Booking.find({ ownerEmail }).populate("property");
        res.status(200).json({
            success: true,
            message: "Owner bookings retrieved",
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

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { paymentStatus, updatedAt: Date.now() },
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
            message: "Payment status updated",
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating payment status",
            error: error.message
        });
    }
};
