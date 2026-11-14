
import { useEffect, useState } from "react";
import "../style/adminComplaints.css";

function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    // Fetch All Complaints
    const fetchComplaints = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/complaints",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load complaints");
            }

            setComplaints(
                Array.isArray(data)
                    ? data
                    : data.complaints || data.data || []
            );
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Update Complaint Status
    const updateComplaint = async (id, status, adminRemarks) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/complaints/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status,
                        adminRemarks
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Status update failed");
            }

            setMessage("Complaint updated successfully!");
            fetchComplaints();

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="admin-complaints-container">

            <div className="admin-complaints-heading">
                <span>ADMIN PANEL</span>
                <h1>Complaint Management</h1>
                <p>Manage and resolve farmer complaints.</p>
            </div>

            {message && (
                <div className="admin-complaint-message">
                    {message}
                </div>
            )}

            {loading ? (
                <p>Loading complaints...</p>
            ) : complaints.length === 0 ? (
                <p className="no-admin-complaints">
                    No complaints found.
                </p>
            ) : (
                <div className="admin-complaints-list">

                    {complaints.map((complaint) => (
                        <ComplaintCard
                            key={complaint._id}
                            complaint={complaint}
                            onUpdate={updateComplaint}
                        />
                    ))}

                </div>
            )}

        </div>
    );
}

function ComplaintCard({ complaint, onUpdate }) {
    const [status, setStatus] = useState(complaint.status);
    const [adminRemarks, setAdminRemarks] = useState(
        complaint.adminRemarks || ""
    );

    const handleUpdate = () => {
        onUpdate(complaint._id, status, adminRemarks);
    };

    return (
        <div className="admin-complaint-card">

            <div className="admin-complaint-top">
                <h2>{complaint.category}</h2>
                <span className="admin-complaint-status">
                    {complaint.status}
                </span>
            </div>

            <p>
                <strong>Complaint ID:</strong> {complaint.complaintId}
            </p>

            <p>
                <strong>Farmer:</strong>{" "}
                {complaint.user?.name || "Farmer"}
            </p>

            <p>
                <strong>Description:</strong> {complaint.description}
            </p>

            {complaint.image && (
                <img
                    src={complaint.image}
                    alt="Complaint"
                    className="admin-complaint-image"
                />
            )}

            <label>Update Status</label>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
            </select>

            <label>Admin Remarks</label>

            <textarea
                rows="3"
                placeholder="Write remarks for farmer..."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
            />

            <button onClick={handleUpdate}>
                Update Complaint
            </button>

        </div>
    );
}

export default AdminComplaints;
