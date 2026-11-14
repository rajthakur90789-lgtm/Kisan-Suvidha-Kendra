
const Rental = require("../model/Rental");

// Get All Rental Bookings (Admin)
const getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find()
            .populate("user", "name phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalRentals: rentals.length,
            rentals
        });

    } catch (error) {
        console.error("Get All Rentals Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch rental bookings"
        });
    }
};

// Update Rental Booking Status (Admin)
const updateRentalStatus = async (req, res) => {
    try {
        const { status, remarks, totalAmount } = req.body;
        const { id } = req.params;

        const allowedStatuses = [
            "Pending",
            "Approved",
            "Rejected",
            "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental status"
            });
        }

        const rental = await Rental.findById(id);

        if (!rental) {
            return res.status(404).json({
                success: false,
                message: "Rental booking not found"
            });
        }

        rental.status = status;

        if (remarks !== undefined) {
            rental.remarks = remarks;
        }

        if (totalAmount !== undefined) {
            const amount = Number(totalAmount);

            if (!Number.isFinite(amount) || amount < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Total amount must be a valid non-negative number"
                });
            }

            rental.totalAmount = amount;
        }

        await rental.save();

        return res.status(200).json({
            success: true,
            message: "Rental booking status updated successfully",
            rental
        });

    } catch (error) {
        console.error("Update Rental Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update rental booking status"
        });
    }
};

module.exports = {
    getAllRentals,
    updateRentalStatus
};
