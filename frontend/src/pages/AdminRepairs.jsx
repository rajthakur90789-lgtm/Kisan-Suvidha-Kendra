
import { useEffect, useState, useCallback } from "react";
import "../style/adminRepairs.css";

const API_URL = "http://localhost:5000/api/admin/repairs";

function AdminRepairs() {
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const token = localStorage.getItem("token");

    // Fetch All Repair Requests
    const fetchRepairs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            if (!token) {
                setError("Admin login token not found. Please login again.");
                return;
            }

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            console.log("Admin Repair API Status:", response.status);
            console.log("Admin Repair API Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load repair requests."
                );
            }

            // Handle different response formats
            const repairList = Array.isArray(data)
                ? data
                : Array.isArray(data.repairs)
                    ? data.repairs
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

            setRepairs(repairList);

        } catch (err) {
            console.error("Fetch Repairs Error:", err);
            setError(err.message || "Server connection failed.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRepairs();
    }, [fetchRepairs]);

    // Update Repair Status
    const updateStatus = async (id, status) => {
        const remarks = window.prompt(
            "Enter admin remarks:",
            ""
        );

        if (remarks === null) return;

        const estimatedCostInput = window.prompt(
            "Enter estimated repair cost (₹):",
            "0"
        );

        if (estimatedCostInput === null) return;

        const estimatedCost = Number(estimatedCostInput);

        if (
            estimatedCostInput.trim() === "" ||
            !Number.isFinite(estimatedCost) ||
            estimatedCost < 0
        ) {
            alert("Please enter a valid repair cost.");
            return;
        }

        try {
            setUpdatingId(id);

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    adminRemarks: remarks,
                    estimatedCost
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Repair status update failed."
                );
            }

            alert("Repair request updated successfully!");

            await fetchRepairs();

        } catch (err) {
            console.error("Update Repair Error:", err);
            alert(err.message || "Server connection failed.");
        } finally {
            setUpdatingId(null);
        }
    };

    // Loading Screen
    if (loading) {
        return (
            <div className="admin-repairs-container">
                <h2>Loading Repair Requests...</h2>
            </div>
        );
    }

    return (
        <div className="admin-repairs-container">

            {/* Page Heading */}
            <div className="admin-repairs-heading">
                <div>
                    <h1>Admin Repair Management</h1>
                    <p>Manage farmer pump repair requests.</p>
                </div>

                <button
                    className="repair-refresh-btn"
                    onClick={fetchRepairs}
                    disabled={loading}
                >
                    Refresh Requests
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="admin-repairs-empty">
                    <p>{error}</p>
                    <button onClick={fetchRepairs}>
                        Try Again
                    </button>
                </div>
            )}

            {/* Total Requests */}
            {!error && (
                <div className="repair-total-count">
                    Total Repair Requests: <strong>{repairs.length}</strong>
                </div>
            )}

            {/* Empty State */}
            {!error && repairs.length === 0 && (
                <div className="admin-repairs-empty">
                    <h2>No Repair Requests Found</h2>
                    <p>
                        Farmer pump repair requests will appear here.
                    </p>
                </div>
            )}

            {/* Repair Cards */}
            {!error && repairs.length > 0 && (
                <div className="admin-repairs-grid">

                    {repairs.map((repair) => (
                        <div
                            className="admin-repair-card"
                            key={repair._id}
                        >
                            <h2>{repair.pumpName}</h2>

                            <p>
                                <strong>Request ID:</strong>{" "}
                                {repair._id}
                            </p>

                            <p>
                                <strong>Pump Type:</strong>{" "}
                                {repair.pumpType}
                            </p>

                            <p>
                                <strong>Problem:</strong>{" "}
                                {repair.problemCategory}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {repair.description}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {repair.location}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`repair-status ${repair.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                                    {repair.status}
                                </span>
                            </p>

                            <p>
                                <strong>Estimated Cost:</strong>{" "}
                                ₹{repair.estimatedCost || 0}
                            </p>

                            {repair.adminRemarks && (
                                <p>
                                    <strong>Admin Remarks:</strong>{" "}
                                    {repair.adminRemarks}
                                </p>
                            )}

                            <div className="admin-repair-actions">

                                <button
                                    disabled={updatingId === repair._id}
                                    onClick={() =>
                                        updateStatus(repair._id, "Approved")
                                    }
                                >
                                    {updatingId === repair._id
                                        ? "Updating..."
                                        : "Approve"}
                                </button>

                                <button
                                    disabled={updatingId === repair._id}
                                    onClick={() =>
                                        updateStatus(repair._id, "In Progress")
                                    }
                                >
                                    In Progress
                                </button>

                                <button
                                    disabled={updatingId === repair._id}
                                    onClick={() =>
                                        updateStatus(repair._id, "Completed")
                                    }
                                >
                                    Complete
                                </button>

                                <button
                                    disabled={updatingId === repair._id}
                                    onClick={() =>
                                        updateStatus(repair._id, "Rejected")
                                    }
                                >
                                    Reject
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default AdminRepairs;
