
import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/register.css";

function Register() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Registration Successful! Please Login.");

                setName("");
                setPhone("");
                setEmail("");
                setPassword("");
            } else {
                alert(data.message || "Registration Failed");
            }

        } catch (error) {
            console.error("Registration Error:", error);
            alert("Backend server connection failed.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">

                <h2>Farmer Registration 🌾</h2>
                <p>Create your Kisan Suvidha Kendra account</p>

                <form onSubmit={handleRegister}>

                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Mobile Number</label>
                    <input
                        type="tel"
                        placeholder="Enter 10 digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength="10"
                        pattern="[0-9]{10}"
                        required
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="6"
                        required
                    />

                    <button type="submit">
                        Create Account
                    </button>

                </form>

                <p className="login-text">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;
