
import "./style/App.css";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Complaints from "./pages/Complaints";
import Rentals from "./pages/Rentals";
import Repairs from "./pages/Repairs";
import Chatbot from "./pages/Chatbot";
import CropDisease from "./pages/CropDisease";

import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminRentals from "./pages/AdminRentals";
import AdminRepairs from "./pages/AdminRepairs";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <NavBar />

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/complaints" element={<Complaints />} />
                    <Route path="/rentals" element={<Rentals />} />
                    <Route path="/repairs" element={<Repairs />} />

                    {/* Kisan Mitra AI Chatbot */}
                    <Route path="/chatbot" element={<Chatbot />} />

                    {/* AI Crop Disease Detection */}
                    <Route
                        path="/crop-disease"
                        element={<CropDisease />}
                    />

                    <Route element={<AdminProtectedRoute />}>
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/products"
                            element={<AdminProducts />}
                        />

                        <Route
                            path="/admin/complaints"
                            element={<AdminComplaints />}
                        />

                        <Route
                            path="/admin/rentals"
                            element={<AdminRentals />}
                        />

                        <Route
                            path="/admin/repairs"
                            element={<AdminRepairs />}
                        />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
