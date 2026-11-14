
import { useEffect, useState } from "react";
import "../style/adminRentals.css";

function AdminRentals() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchRentals = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/rentals",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setRentals(
                    Array.isArray(data)
                        ? data
                        : data.rentals || data.data || []
                );
            } else {
                alert(data.message || "Unable to load rental bookings");
            }
        } catch (error) {
            console.error("Fetch Rentals Error:", error);
            alert("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const updateStatus = async (id, status) => {
        const remarks = window.prompt("Enter admin remarks:");

        if (remarks === null) return;

        try {
            setUpdatingId(id);

            const response = await fetch(
                `http://localhost:5000/api/admin/rentals/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status,
                        remarks
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Rental booking updated successfully!");
                fetchRentals();
            } else {
                alert(data.message || "Status update failed");
            }
        } catch (error) {
            console.error("Update Rental Error:", error);
            alert("Server connection failed");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return <h2>Loading Rental Bookings...</h2>;
    }

    return (
        <div className="admin-rentals-container">
            <div className="admin-rentals-heading">
                <h1>Admin Rental Management</h1>
                <p>Manage all farmer equipment rental bookings.</p>
            </div>

            {rentals.length === 0 ? (
                <div className="admin-rentals-empty">
                    No Rental Bookings Found.
                </div>
            ) : (
                <div className="admin-rentals-grid">
                    {rentals.map((rental) => (
                        <div className="admin-rental-card" key={rental._id}>
                            <h2>{rental.equipmentName}</h2>

                            <p><strong>Category:</strong> {rental.category}</p>
                            <p><strong>Booking Date:</strong> {rental.bookingDate?.slice(0, 10)}</p>
                            <p><strong>Duration:</strong> {rental.durationDays} Days</p>
                            <p><strong>Location:</strong> {rental.location}</p>
                            <p><strong>Status:</strong> {rental.status}</p>
                            <p><strong>Amount:</strong> ₹{rental.totalAmount || 0}</p>

                            {rental.remarks && (
                                <p><strong>Remarks:</strong> {rental.remarks}</p>
                            )}

                            <div className="admin-rental-actions">
                                <button
                                    disabled={updatingId === rental._id}
                                    onClick={() => updateStatus(rental._id, "Approved")}
                                >
                                    Approve
                                </button>

                                <button
                                    disabled={updatingId === rental._id}
                                    onClick={() => updateStatus(rental._id, "Rejected")}
                                >
                                    Reject
                                </button>

                                <button
                                    disabled={updatingId === rental._id}
                                    onClick={() => updateStatus(rental._id, "Completed")}
                                >
                                    Complete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminRentals;
