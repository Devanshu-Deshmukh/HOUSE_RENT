const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Get all bookings
router.get("/", bookingController.getAllBookings);

// Get bookings by tenant
router.get("/tenant/:tenantEmail", bookingController.getBookingsByTenant);

// Get bookings by owner
router.get("/owner/:ownerEmail", bookingController.getBookingsByOwner);

// Get booking by ID
router.get("/:id", bookingController.getBookingById);

// Create booking
router.post("/", bookingController.createBooking);

// Update booking status
router.put("/:id/status", bookingController.updateBookingStatus);

// Update payment status
router.put("/:id/payment", bookingController.updatePaymentStatus);

// Cancel booking
router.delete("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
