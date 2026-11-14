
const User = require("../model/User");
const Product = require("../model/Product");
const Complaint = require("../model/Complaint");
const Rental = require("../model/Rental");
const Repair = require("../model/Repair");

const getDashboardStats = async (req, res) => {
    try {
        const totalFarmers = await User.countDocuments({
            role: "farmer"
        });

        const totalProducts = await Product.countDocuments();

        const totalComplaints = await Complaint.countDocuments();

        const totalRentals = await Rental.countDocuments();

        const totalRepairs = await Repair.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalFarmers,
                totalProducts,
                totalComplaints,
                totalRentals,
                totalRepairs
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Dashboard statistics failed",
            error: error.message
        });
    }
};

module.exports = { getDashboardStats };
