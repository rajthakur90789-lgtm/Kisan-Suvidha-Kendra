
const Complaint = require("../model/Complaint");

// Generate unique Complaint ID
const generateComplaintId = () => {
    return "KSK-" + Date.now();
};

// =================================
// Create New Complaint
// =================================
const createComplaint = async (req, res) => {
    try {
        const { category, description } = req.body;

        // Validate required fields
        if (!category || !description) {
            return res.status(400).json({
                success: false,
                message: "Category and description are required"
            });
        }

        // Create complaint
        const complaint = await Complaint.create({
            complaintId: generateComplaintId(),
            user: req.user._id,
            category,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {
        console.error("Create Complaint Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit complaint"
        });
    }
};

// =================================
// Get Farmer's All Complaints
// =================================
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalComplaints: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get Complaints Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch complaints"
        });
    }
};

// =================================
// Track Complaint by ID
// =================================
const trackComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;

        const complaint = await Complaint.findOne({
            complaintId,
            user: req.user._id
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Complaint details fetched successfully",
            complaint
        });

    } catch (error) {
        console.error("Track Complaint Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to track complaint"
        });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    trackComplaint
};
