
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            enum: [
                "Crop Problem",
                "Equipment Problem",
                "Irrigation Problem",
                "Pump Repair",
                "Pump Problem",
                "Water Problem",
                "Product Problem",
                "Other"
            ],
            required: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Resolved",
                "Rejected"
            ],
            default: "Pending"
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

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
