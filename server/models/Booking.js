const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    tenant: {
        type: String,
        required: true
    },
    tenantEmail: {
        type: String,
        required: true
    },
    tenantPhone: {
        type: String,
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    bookingStartDate: {
        type: Date,
        required: true
    },
    bookingEndDate: {
        type: Date,
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected", "completed"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    numberOfMonths: Number,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
