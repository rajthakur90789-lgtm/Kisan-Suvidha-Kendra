
const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        pumpName: {
            type: String,
            required: true,
            trim: true
        },

        pumpType: {
            type: String,
            enum: ["Submersible", "Monoblock", "Centrifugal", "Other"],
            required: true
        },

        problemCategory: {
            type: String,
            enum: [
                "Motor Not Starting",
                "Low Water Pressure",
                "Water Leakage",
                "Electrical Problem",
                "Other"
            ],
            required: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "In Progress", "Completed", "Rejected"],
            default: "Pending"
        },

        estimatedCost: {
            type: Number,
            default: 0,
            min: 0
        },

        adminRemarks: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Repair = mongoose.model("Repair", repairSchema);

module.exports = Repair;
