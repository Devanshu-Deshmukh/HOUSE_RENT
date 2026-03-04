const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { verifyToken, isOwner } = require("../middlewares/authMiddleware");

// Get my properties (by email)
router.get("/properties/:ownerEmail", ownerController.getMyProperties);

// Get my bookings (by email)
router.get("/bookings/:ownerEmail", ownerController.getMyBookings);

// Get tenant inquiries (pending bookings)
router.get("/inquiries/:ownerEmail", ownerController.getTenantInquiries);

// Get owner statistics
router.get("/stats/:ownerEmail", ownerController.getOwnerStats);

// Get specific booking details
router.get("/booking/:id", ownerController.getBookingDetails);

// Protected Routes (require authentication)

// Add new property (owner only)
router.post("/properties", verifyToken, isOwner, ownerController.addProperty);

// Update property
router.put("/properties/:id", verifyToken, isOwner, ownerController.updateProperty);

// Delete property
router.delete("/properties/:id", verifyToken, isOwner, ownerController.deleteProperty);

// Update booking status
router.put("/bookings/:id/status", verifyToken, isOwner, ownerController.updateBookingStatus);

// Mark property as available
router.put("/properties/:id/available", verifyToken, isOwner, ownerController.markAvailable);

module.exports = router;
