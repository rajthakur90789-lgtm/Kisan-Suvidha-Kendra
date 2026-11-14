
const mongoose = require("mongoose");
const Repair = require("../model/Repair");

// =====================================
// Get All Pump Repair Requests (Admin)
// =====================================
const getAllRepairRequests = async (req, res) => {
    try {
        const repairs = await Repair.find()
            .populate("user", "name phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalRepairs: repairs.length,
            repairs
        });

    } catch (error) {
        console.error("Get All Repairs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch repair requests",
            error: error.message
        });
    }
};


// =====================================
// Update Pump Repair Request Status
// =====================================
const updateRepairStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminRemarks, estimatedCost } = req.body;

        // Check MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair request ID"
            });
        }

        // Allowed Status
        const allowedStatuses = [
            "Pending",
            "Approved",
            "In Progress",
            "Completed",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair status"
            });
        }

        // Find Repair Request
        const repair = await Repair.findById(id);

        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair request not found"
            });
        }

        // Update Status
        repair.status = status;

        // Update Admin Remarks
        if (adminRemarks !== undefined) {
            repair.adminRemarks = adminRemarks;
        }

        // Update Estimated Cost
        if (estimatedCost !== undefined) {
            const cost = Number(estimatedCost);

            if (
                !Number.isFinite(cost) ||
                cost < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Estimated cost must be a valid non-negative number"
                });
            }

            repair.estimatedCost = cost;
        }

        // Save Changes
        await repair.save();

        return res.status(200).json({
            success: true,
            message: "Repair request updated successfully",
            repair
        });

    } catch (error) {
        console.error("Update Repair Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update repair request",
            error: error.message
        });
    }
};


// Export Controllers
module.exports = {
    getAllRepairRequests,
    updateRepairStatus
};
