
const Complaint = require("../model/Complaint");

// =================================
// Get All Complaints (Admin)
// =================================
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("user", "name phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalComplaints: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get All Complaints Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch complaints"
        });
    }
};

// =================================
// Update Complaint Status (Admin)
// =================================
const updateComplaintStatus = async (req, res) => {
    try {
        const { status, adminRemarks } = req.body;
        const { id } = req.params;

        const allowedStatus = [
            "Pending",
            "In Progress",
            "Resolved",
            "Rejected"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint status"
            });
        }

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        complaint.status = status;

        if (adminRemarks !== undefined) {
            complaint.adminRemarks = adminRemarks;
        }

        await complaint.save();

        return res.status(200).json({
            success: true,
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {
        console.error("Update Complaint Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update complaint status"
        });
    }
};

module.exports = {
    getAllComplaints,
    updateComplaintStatus
};
