
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/adminDashboard.css";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalFarmers: 0,
        totalProducts: 0,
        totalComplaints: 0,
        totalRentals: 0,
        totalRepairs: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard/stats",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load dashboard");
                }

                setStats(data.stats);
            } catch (error) {
                console.error("Dashboard Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const dashboardCards = [
        {
            title: "Total Farmers",
            value: stats.totalFarmers,
            icon: "👨‍🌾",
            color: "green"
        },
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: "🌱",
            color: "blue"
        },
        {
            title: "Total Complaints",
            value: stats.totalComplaints,
            icon: "📢",
            color: "orange"
        },
        {
            title: "Total Rentals",
            value: stats.totalRentals,
            icon: "🚜",
            color: "purple"
        },
        {
            title: "Total Pump Repairs",
            value: stats.totalRepairs,
            icon: "🔧",
            color: "red"
        }
    ];

    if (loading) {
        return <h2 className="dashboard-loading">Loading Admin Dashboard...</h2>;
    }

    if (error) {
        return <h2 className="dashboard-error">{error}</h2>;
    }

    return (
        <div className="admin-dashboard">

            <div className="admin-dashboard-heading">
                <span>ADMIN PANEL</span>
                <h1>Admin Dashboard</h1>
                <p>Manage your Kisan Suvidha Kendra services.</p>
            </div>

            <div className="admin-stats-grid">
                {dashboardCards.map((card, index) => (
                    <div className={`admin-stat-card ${card.color}`} key={index}>
                        <div className="admin-stat-icon">
                            {card.icon}
                        </div>

                        <div>
                            <h3>{card.title}</h3>
                            <h2>{card.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-quick-actions">
                <h2>Quick Management</h2>

                <div className="admin-action-grid">
                    <Link to="/admin/products" className="admin-action-card">
                        <span>📦</span>
                        <h3>Manage Products</h3>
                        <p>Add, update and delete products.</p>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;
