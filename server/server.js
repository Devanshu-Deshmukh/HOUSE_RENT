const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/houseRentDB";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// Import Routes
const houseRoutes = require("./routes/houseRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

// Use Routes
app.use("/api/houses", houseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);

// Basic Route
app.get("/", (req, res) => {
    res.json({ 
        message: "🏠 House Rent API is running successfully!",
        version: "2.0 (Advanced Features)",
        endpoints: {
            houses: "/api/houses",
            users: "/api/users",
            bookings: "/api/bookings",
            admin: "/api/admin (requires token + admin role)",
            owner: "/api/owner (requires token + owner role)"
        }
    });
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "🟢 Server is healthy" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: "Server Error", 
        error: err.message 
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   - Houses: GET/POST http://localhost:${PORT}/api/houses`);
    console.log(`   - Users: GET/POST http://localhost:${PORT}/api/users`);
    console.log(`   - Bookings: GET/POST http://localhost:${PORT}/api/bookings`);
    console.log(`   - Admin: http://localhost:${PORT}/api/admin`);
    console.log(`   - Owner: http://localhost:${PORT}/api/owner`);
});
