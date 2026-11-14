
const express = require("express");
const router = express.Router();

// Import Admin Rental Controller
const {
    getAllRentals,
    updateRentalStatus
} = require("../controllers/adminRentalController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Get All Rental Bookings
router.get("/", protect, adminOnly, getAllRentals);

// Update Rental Booking Status
router.put("/:id", protect, adminOnly, updateRentalStatus);

module.exports = router;
