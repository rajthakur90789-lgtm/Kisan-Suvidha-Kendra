
const Repair = require("../model/Repair");

// Create Pump Repair Request
const createRepairRequest = async (req, res) => {
    try {
        const {
            pumpName,
            pumpType,
            problemCategory,
            description,
            location
        } = req.body;

        // Validate required fields
        if (
            !pumpName ||
            !pumpType ||
            !problemCategory ||
            !description ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Save repair request
        const repair = await Repair.create({
            user: req.user._id,
            pumpName,
            pumpType,
            problemCategory,
            description,
            location
        });

        return res.status(201).json({
            success: true,
            message: "Pump repair request submitted successfully",
            repair
        });

    } catch (error) {
        console.error("Create Repair Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit repair request"
        });
    }
};

// Get Farmer's Repair Requests
const getMyRepairRequests = async (req, res) => {
    try {
        const repairs = await Repair.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalRepairs: repairs.length,
            repairs
        });

    } catch (error) {
        console.error("Get Repair Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch repair requests"
        });
    }
};

module.exports = {
    createRepairRequest,
    getMyRepairRequests
};
