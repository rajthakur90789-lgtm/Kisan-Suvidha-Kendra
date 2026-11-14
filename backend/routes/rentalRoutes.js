
const express = require("express");
const router = express.Router();

// Import Rental Controllers
const {
    createRental,
    getMyRentals
} = require("../controllers/rentalController");

// Import Authentication Middleware
const { protect } = require("../middleware/authMiddleware");

// Create Equipment Booking
router.post("/", protect, createRental);

// Get Farmer's All Bookings
router.get("/my", protect, getMyRentals);

module.exports = router;
