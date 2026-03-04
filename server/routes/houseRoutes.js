const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");

// Get all houses
router.get("/", houseController.getAllHouses);

// Get available houses
router.get("/available", houseController.getAvailableHouses);

// Search houses
router.get("/search", houseController.searchHouses);

// Get houses by owner
router.get("/owner/:ownerEmail", houseController.getHousesByOwner);

// Get single house by ID
router.get("/:id", houseController.getHouseById);

// Add new house
router.post("/", houseController.addHouse);

// Update house
router.put("/:id", houseController.updateHouse);

// Delete house
router.delete("/:id", houseController.deleteHouse);

module.exports = router;
