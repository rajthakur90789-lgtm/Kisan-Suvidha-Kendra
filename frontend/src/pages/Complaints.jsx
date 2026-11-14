
import { useEffect, useState } from "react";
import "../style/complaints.css";

function Complaints() {
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    // Fetch Farmer Complaints
    const fetchComplaints = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/complaints/my-complaints",
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

    // Submit New Complaint
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/complaints",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        category,
                        description,
                        image
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Complaint submission failed");
            }

            setMessage(
                `Complaint submitted successfully! Complaint ID: ${
                    data.complaint?.complaintId ||
                    data.complaintId ||
                    data.data?.complaintId ||
                    "Please check your complaint history"
                }`
            );

            setCategory("");
            setDescription("");
            setImage("");

            fetchComplaints();

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="complaints-container">

            <div className="complaints-heading">
                <span>FARMER SUPPORT</span>
                <h1>Complaint Management</h1>
                <p>Register your farming problems and track their status.</p>
            </div>

            <div className="complaint-form-card">
                <h2>Submit New Complaint</h2>

                {message && (
                    <div className="complaint-message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Complaint Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Water Problem">Water Problem</option>
                        <option value="Equipment Problem">Equipment Problem</option>
                        <option value="Pump Problem">Pump Problem</option>
                        <option value="Product Problem">Product Problem</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Problem Description</label>
                    <textarea
                        placeholder="Describe your problem..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        required
                    />

                    <label>Image URL (Optional)</label>
                    <input
                        type="url"
                        placeholder="Paste problem image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />

                    <button type="submit">
                        Submit Complaint
                    </button>

                </form>
            </div>

            <div className="complaint-history">
                <h2>My Complaints</h2>

                {loading ? (
                    <p>Loading complaints...</p>
                ) : complaints.length === 0 ? (
                    <p className="no-complaints">
                        You have not submitted any complaints yet.
                    </p>
                ) : (
                    <div className="complaints-list">
                        {complaints.map((complaint) => (
                            <div
                                className="complaint-card"
                                key={complaint._id}
                            >
                                <h3>{complaint.category}</h3>

                                <p>
                                    <strong>Complaint ID:</strong>{" "}
                                    {complaint.complaintId}
                                </p>

                                <p>
                                    <strong>Description:</strong>{" "}
                                    {complaint.description}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className="complaint-status">
                                        {complaint.status}
                                    </span>
                                </p>

                                {complaint.adminRemarks && (
                                    <p>
                                        <strong>Admin Remarks:</strong>{" "}
                                        {complaint.adminRemarks}
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

export default Complaints;
