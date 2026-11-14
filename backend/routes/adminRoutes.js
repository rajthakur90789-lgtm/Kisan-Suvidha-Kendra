
const express = require("express");
const router = express.Router();

// Import Controllers
const {
    getAllComplaints,
    updateComplaintStatus
} = require("../controllers/adminComplaintController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Get All Complaints (Admin Only)
router.get(
    "/complaints",
    protect,
    adminOnly,
    getAllComplaints
);

// Update Complaint Status (Admin Only)
router.put(
    "/complaints/:id",
    protect,
    adminOnly,
    updateComplaintStatus
);

module.exports = router;
