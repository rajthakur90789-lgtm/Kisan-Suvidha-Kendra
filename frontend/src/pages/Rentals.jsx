
import { useEffect, useState } from "react";
import "../style/rentals.css";

function Rentals() {
    const [equipmentName, setEquipmentName] = useState("");
    const [category, setCategory] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [durationDays, setDurationDays] = useState("");
    const [location, setLocation] = useState("");

    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    // Fetch Farmer Rental Bookings
    const fetchRentals = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/rentals/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load bookings");
            }

            setRentals(
                Array.isArray(data)
                    ? data
                    : data.rentals || data.data || []
            );
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    // Submit Rental Booking
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/rentals",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        equipmentName,
                        category,
                        bookingDate,
                        durationDays: Number(durationDays),
                        location
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Booking failed");
            }

            setMessage("Equipment rental booking submitted successfully!");

            setEquipmentName("");
            setCategory("");
            setBookingDate("");
            setDurationDays("");
            setLocation("");

            fetchRentals();

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="rentals-container">

            <div className="rentals-heading">
                <span>FARMER SERVICES</span>
                <h1>Equipment Rental Service</h1>
                <p>Book agricultural equipment for your farming needs.</p>
            </div>

            <div className="rental-form-card">

                <h2>Book Equipment</h2>

                {message && (
                    <div className="rental-message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Equipment Name</label>
                    <input
                        type="text"
                        placeholder="Example: Tractor"
                        value={equipmentName}
                        onChange={(e) => setEquipmentName(e.target.value)}
                        required
                    />

                    <label>Equipment Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Tractor">Tractor</option>
                        <option value="Rotavator">Rotavator</option>
                        <option value="Harvester">Harvester</option>
                        <option value="Water Pump">Water Pump</option>
                        <option value="Sprayer">Sprayer</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Booking Date</label>
                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                    />

                    <label>Duration (Days)</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="Enter number of days"
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                        required
                    />

                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="Enter your village/location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Submit Rental Booking
                    </button>

                </form>
            </div>

            <div className="rental-history">

                <h2>My Rental Bookings</h2>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : rentals.length === 0 ? (
                    <p className="no-rentals">
                        You have not booked any equipment yet.
                    </p>
                ) : (
                    <div className="rentals-list">

                        {rentals.map((rental) => (
                            <div className="rental-card" key={rental._id}>

                                <h3>{rental.equipmentName}</h3>

                                <p>
                                    <strong>Category:</strong> {rental.category}
                                </p>

                                <p>
                                    <strong>Booking Date:</strong>{" "}
                                    {new Date(rental.bookingDate).toLocaleDateString()}
                                </p>

                                <p>
                                    <strong>Duration:</strong>{" "}
                                    {rental.durationDays} Days
                                </p>

                                <p>
                                    <strong>Location:</strong> {rental.location}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className="rental-status">
                                        {rental.status}
                                    </span>
                                </p>

                                {rental.totalAmount > 0 && (
                                    <p>
                                        <strong>Total Amount:</strong> ₹{rental.totalAmount}
                                    </p>
                                )}

                                {rental.remarks && (
                                    <p>
                                        <strong>Admin Remarks:</strong>{" "}
                                        {rental.remarks}
                                    </p>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Rentals;
