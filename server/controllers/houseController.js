const House = require("../models/House");

// Get all houses
exports.getAllHouses = async (req, res) => {
    try {
        const houses = await House.find();
        res.status(200).json({
            success: true,
            message: "Houses retrieved successfully",
            data: houses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving houses",
            error: error.message
        });
    }
};

// Get available houses
exports.getAvailableHouses = async (req, res) => {
    try {
        const houses = await House.find({ isAvailable: true });
        res.status(200).json({
            success: true,
            message: "Available houses retrieved",
            data: houses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving available houses",
            error: error.message
        });
    }
};

// Get single house by ID
exports.getHouseById = async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if (!house) {
            return res.status(404).json({
                success: false,
                message: "House not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "House retrieved successfully",
            data: house
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving house",
            error: error.message
        });
    }
};

// Add new house
exports.addHouse = async (req, res) => {
    try {
        const newHouse = new House(req.body);
        const savedHouse = await newHouse.save();
        res.status(201).json({
            success: true,
            message: "House added successfully",
            data: savedHouse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error adding house",
            error: error.message
        });
    }
};

// Update house
exports.updateHouse = async (req, res) => {
    try {
        const updatedHouse = await House.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedHouse) {
            return res.status(404).json({
                success: false,
                message: "House not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "House updated successfully",
            data: updatedHouse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating house",
            error: error.message
        });
    }
};

// Delete house
exports.deleteHouse = async (req, res) => {
    try {
        const deletedHouse = await House.findByIdAndDelete(req.params.id);
        if (!deletedHouse) {
            return res.status(404).json({
                success: false,
                message: "House not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "House deleted successfully",
            data: deletedHouse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting house",
            error: error.message
        });
    }
};

// Search houses
exports.searchHouses = async (req, res) => {
    try {
        const { city, minRent, maxRent, bedrooms } = req.query;
        let filter = {};

        if (city) filter.city = city;
        if (bedrooms) filter.bedrooms = bedrooms;
        if (minRent || maxRent) {
            filter.rent = {};
            if (minRent) filter.rent.$gte = minRent;
            if (maxRent) filter.rent.$lte = maxRent;
        }

        const houses = await House.find(filter);
        res.status(200).json({
            success: true,
            message: "Search results",
            data: houses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching houses",
            error: error.message
        });
    }
};

// Get houses by owner
exports.getHousesByOwner = async (req, res) => {
    try {
        const { ownerEmail } = req.params;
        const houses = await House.find({ ownerEmail });
        res.status(200).json({
            success: true,
            message: "Owner's houses retrieved",
            data: houses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving owner's houses",
            error: error.message
        });
    }
};
