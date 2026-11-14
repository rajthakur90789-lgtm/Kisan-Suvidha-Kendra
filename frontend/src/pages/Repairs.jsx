
import { useEffect, useState } from "react";
import "../style/repairs.css";

function Repairs() {
    const [pumpName, setPumpName] = useState("");
    const [pumpType, setPumpType] = useState("");
    const [problemCategory, setProblemCategory] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // Backend API URL
    const API_URL = "http://localhost:5000/api/repairs";

    // Get Farmer's Repair Requests
    const fetchRepairs = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please login to view your repair requests.");
            setMessageType("error");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/my`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Unable to load repair requests.");
                setMessageType("error");
                return;
            }

            setRepairs(data.repairs || []);

        } catch (error) {
            console.error("Fetch Repairs Error:", error);
            setMessage("Server connection failed.");
            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    // Load Repair History
    useEffect(() => {
        fetchRepairs();
    }, []);

    // Submit Pump Repair Request
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please login before submitting a repair request.");
            setMessageType("error");
            return;
        }

        setSubmitting(true);
        setMessage("");
        setMessageType("");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    pumpName,
                    pumpType,
                    problemCategory,
                    description,
                    location
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Request submission failed.");
                setMessageType("error");
                return;
            }

            setMessage(
                data.message || "Pump repair request submitted successfully!"
            );
            setMessageType("success");

            // Reset Form
            setPumpName("");
            setPumpType("");
            setProblemCategory("");
            setDescription("");
            setLocation("");

            // Refresh Repair History
            setLoading(true);
            await fetchRepairs();

        } catch (error) {
            console.error("Submit Repair Error:", error);
            setMessage("Server connection failed.");
            setMessageType("error");

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="repairs-container">

            {/* Page Heading */}
            <div className="repairs-heading">
                <h1>PUMP REPAIR SERVICE</h1>
                <p>
                    Get reliable repair support for your agricultural pump.
                </p>
            </div>

            <div className="repairs-content">

                {/* Repair Form */}
                <div className="repair-form-card">

                    <h2>Submit Repair Request</h2>

                    <form onSubmit={handleSubmit}>

                        <label>Pump Name</label>
                        <input
                            type="text"
                            placeholder="Enter pump name"
                            value={pumpName}
                            onChange={(e) => setPumpName(e.target.value)}
                            required
                        />

                        <label>Pump Type</label>
                        <select
                            value={pumpType}
                            onChange={(e) => setPumpType(e.target.value)}
                            required
                        >
                            <option value="">Select Pump Type</option>
                            <option value="Submersible">
                                Submersible Pump
                            </option>
                            <option value="Monoblock">
                                Monoblock Pump
                            </option>
                            <option value="Centrifugal">
                                Centrifugal Pump
                            </option>
                            <option value="Other">Other</option>
                        </select>

                        <label>Problem Category</label>
                        <select
                            value={problemCategory}
                            onChange={(e) => setProblemCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Problem</option>
                            <option value="Motor Not Starting">
                                Motor Not Starting
                            </option>
                            <option value="Low Water Pressure">
                                Low Water Pressure
                            </option>
                            <option value="Water Leakage">
                                Water Leakage
                            </option>
                            <option value="Electrical Problem">
                                Electrical Problem
                            </option>
                            <option value="Other">Other</option>
                        </select>

                        <label>Problem Description</label>
                        <textarea
                            placeholder="Describe your pump problem"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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

                        <button type="submit" disabled={submitting}>
                            {submitting
                                ? "Submitting..."
                                : "Submit Repair Request"}
                        </button>

                    </form>

                    {/* Success / Error Message */}
                    {message && (
                        <p
                            className={`repair-message ${messageType}`}
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                </div>

                {/* Repair History */}
                <div className="repair-history-card">

                    <h2>My Repair Requests</h2>

                    {loading ? (
                        <p>Loading repair requests...</p>
                    ) : repairs.length === 0 ? (
                        <p className="repair-empty">
                            You have not submitted any repair request yet.
                        </p>
                    ) : (

                        <div className="repair-list">

                            {repairs.map((repair) => (

                                <div
                                    className="repair-item"
                                    key={repair._id}
                                >

                                    <h3>{repair.pumpName}</h3>

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
                                        {repair.status}
                                    </p>

                                    {repair.estimatedCost > 0 && (
                                        <p>
                                            <strong>Estimated Cost:</strong>{" "}
                                            ₹{repair.estimatedCost}
                                        </p>
                                    )}

                                    {repair.adminRemarks && (
                                        <p>
                                            <strong>Admin Remarks:</strong>{" "}
                                            {repair.adminRemarks}
                                        </p>
                                    )}

                                </div>

                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Repairs;
