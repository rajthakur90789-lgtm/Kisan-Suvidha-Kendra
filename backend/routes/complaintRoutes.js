const express = require("express");
const router = express.Router();

const {
    createComplaint,
    getMyComplaints,
    trackComplaint
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");

// Submit new complaint
router.post("/", protect, createComplaint);

// Get all complaints of logged-in farmer
router.get("/my-complaints", protect, getMyComplaints);

// Track complaint using Complaint ID
router.get("/track/:complaintId", protect, trackComplaint);

module.exports = router;