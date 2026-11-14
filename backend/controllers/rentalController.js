
const Rental = require("../model/Rental");

// =================================
// Create Equipment Rental Booking
// =================================
const createRental = async (req, res) => {
    try {
        const {
            equipmentName,
            category,
            bookingDate,
            durationDays,
            location
        } = req.body;

        // Validate required fields
        if (
            !equipmentName ||
            !category ||
            !bookingDate ||
            !durationDays ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate duration
        if (Number(durationDays) < 1) {
            return res.status(400).json({
                success: false,
                message: "Duration must be at least 1 day"
            });
        }

        // Create booking
        const rental = await Rental.create({
            user: req.user._id,
            equipmentName,
            category,
            bookingDate,
            durationDays,
            location
        });

        return res.status(201).json({
            success: true,
            message: "Equipment booking submitted successfully",
            rental
        });

    } catch (error) {
        console.error("Create Rental Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create rental booking"
        });
    }
};

// =================================
// Get Farmer's All Rental Bookings
// =================================
const getMyRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalRentals: rentals.length,
            rentals
        });

    } catch (error) {
        console.error("Get Rentals Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch rental bookings"
        });
    }
};

module.exports = {
    createRental,
    getMyRentals
};
