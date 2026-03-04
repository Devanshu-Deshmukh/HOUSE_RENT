const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/", userController.getAllUsers);

// Get users by role
router.get("/role/:role", userController.getUsersByRole);

// Get user by ID
router.get("/:id", userController.getUserById);

// Register user
router.post("/register", userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Update user
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
