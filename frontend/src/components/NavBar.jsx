
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";

function NavBar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const [role, setRole] = useState("");

    useEffect(() => {
        const updateAuth = async () => {
            const token = localStorage.getItem("token");

            setIsLoggedIn(!!token);

            if (!token) {
                setRole("");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                const user =
                    data.user ||
                    data.data?.user ||
                    data.data ||
                    data;

                if (response.ok) {
                    setRole(user.role || "");
                } else {
                    setRole("");
                }

            } catch (error) {
                console.error("Navbar Auth Error:", error);
                setRole("");
            }
        };

        updateAuth();

        window.addEventListener("authChanged", updateAuth);

        return () => {
            window.removeEventListener("authChanged", updateAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setRole("");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
        alert("Logout Successful!");
    };

    return (
        <nav className="navbar">

            <div className="logo">
                🌾 Kisan Suvidha Kendra
            </div>

            <ul className="nav-links">

                <li>
                    <Link to="/">Home</Link>
                </li>

                {isLoggedIn && (
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                )}

                {role === "admin" && (
                    <li>
                        <Link to="/admin/dashboard">
                            Admin Panel
                        </Link>
                    </li>
                )}

                <li>
                    <Link to="/products">Products</Link>
                </li>

                <li>
                    <Link to="/complaints">Complaints</Link>
                </li>

                <li>
                    <Link to="/rentals">Equipment Rental</Link>
                </li>

                <li>
                    <Link to="/repairs">Pump Repair</Link>
                </li>

                {isLoggedIn && (
                    <>
                        <li>
                            <Link to="/chatbot">
                                🤖 Kisan Mitra AI
                            </Link>
                        </li>

                        <li>
                            <Link to="/crop-disease">
                                🌿 Crop Disease Detection
                            </Link>
                        </li>
                    </>
                )}

            </ul>

            <div className="nav-buttons">

                {isLoggedIn ? (
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">
                            Login
                        </Link>

                        <Link to="/register" className="register-btn">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default NavBar;
