
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Farmer Name
        name: {
            type: String,
            required: true,
            trim: true
        },

        // Mobile Number
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^[0-9]{10}$/, "Enter a valid 10 digit mobile number"]
        },

        // Email Address
        email: {
            type: String,
            lowercase: true,
            trim: true
        },

        // Password
        password: {
            type: String,
            required: true,
            minlength: 6
        },

        // User Role
        role: {
            type: String,
            enum: ["farmer", "admin"],
            default: "farmer"
        },

        // Farmer Address
        address: {
            village: {
                type: String,
                trim: true
            },
            district: {
                type: String,
                trim: true
            },
            state: {
                type: String,
                default: "Uttar Pradesh"
            },
            pincode: {
                type: String
            }
        },

        // Account Status
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
