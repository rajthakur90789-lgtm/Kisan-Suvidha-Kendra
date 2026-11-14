
const express = require("express");
const router = express.Router();

// Import Admin Repair Controller
const {
    getAllRepairRequests,
    updateRepairStatus
} = require("../controllers/adminRepairController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Get All Repair Requests
router.get("/", protect, adminOnly, getAllRepairRequests);

// Update Repair Request Status
router.put("/:id", protect, adminOnly, updateRepairStatus);

module.exports = router;
