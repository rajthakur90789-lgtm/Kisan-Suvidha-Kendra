
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load Environment Variables FIRST
dotenv.config();

// Import Auth Routes
const authRoutes = require("./routes/authRoutes");

// Import Complaint Routes
const complaintRoutes = require("./routes/complaintRoutes");

// Import Admin Routes
const adminRoutes = require("./routes/adminRoutes");

// Import Rental Routes
const rentalRoutes = require("./routes/rentalRoutes");

// Import Admin Rental Routes
const adminRentalRoutes = require("./routes/adminRentalRoutes");

// Import Repair Routes
const repairRoutes = require("./routes/repairRoutes");

// Import Admin Repair Routes
const adminRepairRoutes = require("./routes/adminRepairRoutes");

// Import Product Routes
const productRoutes = require("./routes/productRoutes");

// Import Admin Dashboard Routes
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");

// Import Kisan Mitra AI Chatbot Routes
const chatbotRoutes = require("./routes/chatbotRoutes");

// Import AI Crop Disease Detection Routes
const cropDiseaseRoutes = require("./routes/cropDiseaseRoutes");

const app = express();

// CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Kisan Suvidha Kendra API is running"
    });
});

// Authentication APIs
app.use("/api/auth", authRoutes);

// Complaint Management APIs
app.use("/api/complaints", complaintRoutes);

// Admin Complaint Management APIs
app.use("/api/admin", adminRoutes);

// Farmer Equipment Rental APIs
app.use("/api/rentals", rentalRoutes);

// Admin Rental Management APIs
app.use("/api/admin/rentals", adminRentalRoutes);

// Farmer Pump Repair APIs
app.use("/api/repairs", repairRoutes);

// Admin Pump Repair Management APIs
app.use("/api/admin/repairs", adminRepairRoutes);

// Product Catalog APIs
app.use("/api/products", productRoutes);

// Admin Dashboard APIs
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Kisan Mitra AI Chatbot API
app.use("/api/chatbot", chatbotRoutes);

// AI Crop Disease Detection API
app.use("/api/crop-disease", cropDiseaseRoutes);

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log("--------------------------------");
            console.log("Kisan Suvidha Kendra Backend");
            console.log("MongoDB Connected Successfully!");
            console.log(`Server running on port ${PORT}`);
            console.log("Kisan Mitra AI Chatbot API Ready!");
            console.log("AI Crop Disease Detection API Ready!");
            console.log("--------------------------------");
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
