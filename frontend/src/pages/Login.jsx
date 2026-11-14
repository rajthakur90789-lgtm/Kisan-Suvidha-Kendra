
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/login.css";

function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Backend API URL
    const API_URL = "http://localhost:5000/api/auth/login";

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: phone.trim(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login Failed");
                return;
            }

            // Save JWT Token
            if (!data.token) {
                alert("Login response mein token nahi mila.");
                return;
            }

            localStorage.setItem("token", data.token);

            // Update Navbar after login
            window.dispatchEvent(new Event("authChanged"));

            alert("Login Successful!");

            // Redirect to Dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login Error:", error);

            alert(
                "Backend server connection failed. Please check backend server and CORS."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h2>Farmer Login 🌾</h2>

                <p>Welcome to Kisan Suvidha Kendra</p>

                <form onSubmit={handleLogin}>

                    <label>Mobile Number</label>

                    <input
                        type="tel"
                        placeholder="Enter 10 digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        pattern="[0-9]{10}"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="register-text">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

            </div>

        </div>
    );
}

export default Login;
