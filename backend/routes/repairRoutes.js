
const express = require("express");
const router = express.Router();

// Import Repair Controller
const {
    createRepairRequest,
    getMyRepairRequests
} = require("../controllers/repairController");

// Import Authentication Middleware
const { protect } = require("../middleware/authMiddleware");

// Submit Pump Repair Request
router.post("/", protect, createRepairRequest);

// Get Farmer's Own Repair Requests
router.get("/my", protect, getMyRepairRequests);

module.exports = router;
