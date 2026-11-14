
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
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

                // Get user details from API response
                const user =
                    data.user ||
                    data.data?.user ||
                    data.data ||
                    data;

                // Check Admin Role
                if (response.ok && user.role === "admin") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }

            } catch (error) {
                console.error("Admin Check Error:", error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    if (loading) {
        return <h2>Checking Admin Access...</h2>;
    }

    if (!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default AdminProtectedRoute;
