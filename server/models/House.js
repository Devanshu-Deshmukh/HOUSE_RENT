const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    ownerPhone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    squareFeet: {
        type: Number
    },
    amenities: [String],
    description: String,
    tenant: {
        type: String,
        default: null
    },
    tenantEmail: {
        type: String,
        default: null
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("House", houseSchema);
