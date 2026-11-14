
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
    {
        // Farmer who booked the equipment
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Equipment details
        equipmentName: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "Tractor",
                "Rotavator",
                "Seeder",
                "Harvester",
                "Water Pump",
                "Sprayer",
                "Other"
            ],
            required: true
        },

        // Booking details
        bookingDate: {
            type: Date,
            required: true
        },

        durationDays: {
            type: Number,
            required: true,
            min: 1
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        // Booking status
        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected",
                "Completed"
            ],
            default: "Pending"
        },

        totalAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        remarks: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
