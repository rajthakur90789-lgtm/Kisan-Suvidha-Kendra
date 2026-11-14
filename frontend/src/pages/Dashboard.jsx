
import { useEffect, useState } from "react";
import "../style/dashboard.css";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/auth/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setUser(data.user || data.data || data);
                } else {
                    setError(data.message || "Profile load nahi ho paya.");
                }
            } catch (error) {
                console.error("Profile Error:", error);
                setError("Backend server connection failed.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <h2 className="dashboard-message">Loading Profile...</h2>;
    }

    if (error) {
        return <h2 className="dashboard-message">{error}</h2>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h2>Farmer Dashboard 🌾</h2>
                <p>Welcome to Kisan Suvidha Kendra</p>

                <div className="profile-details">
                    <p><strong>Name:</strong> {user?.name || "Not Available"}</p>
                    <p><strong>Mobile:</strong> {user?.phone || "Not Available"}</p>
                    <p><strong>Email:</strong> {user?.email || "Not Available"}</p>
                    <p><strong>Village:</strong> {user?.village || user?.address?.village || "Not Available"}</p>
                    <p><strong>District:</strong> {user?.district || user?.address?.district || "Not Available"}</p>
                    <p><strong>State:</strong> {user?.state || user?.address?.state || "Not Available"}</p>
                    <p><strong>Role:</strong> {user?.role || "Farmer"}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
