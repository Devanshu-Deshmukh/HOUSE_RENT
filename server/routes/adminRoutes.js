const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// All admin routes are protected - requires token and admin role

// Get all users
router.get("/users", verifyToken, isAdmin, adminController.getAllUsers);

// Get all properties
router.get("/properties", verifyToken, isAdmin, adminController.getAllProperties);

// Get all bookings
router.get("/bookings", verifyToken, isAdmin, adminController.getAllBookings);

// Get dashboard statistics
router.get("/dashboard", verifyToken, isAdmin, adminController.getDashboardStats);

// Delete any user
router.delete("/users/:id", verifyToken, isAdmin, adminController.deleteUser);

// Delete any property
router.delete("/properties/:id", verifyToken, isAdmin, adminController.deleteProperty);

// Verify user
router.put("/users/:id/verify", verifyToken, isAdmin, adminController.verifyUser);

// Approve booking
router.put("/bookings/:id/approve", verifyToken, isAdmin, adminController.approveBooking);

// Reject booking
router.put("/bookings/:id/reject", verifyToken, isAdmin, adminController.rejectBooking);

module.exports = router;
