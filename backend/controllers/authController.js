
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// ==============================
// Farmer Registration
// ==============================
const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password, address } = req.body;

        // Check required fields
        if (!name || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, phone and password are required"
            });
        }

        // Validate phone number
        if (!/^[0-9]{10}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Enter valid 10 digit mobile number"
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        // Check existing farmer
        const existingUser = await User.findOne({
            phone: phone.trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Mobile number already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new farmer
        const user = await User.create({
            name: name.trim(),
            phone: phone.trim(),
            email,
            password: hashedPassword,
            address,
            role: "farmer"
        });

        // Generate token
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "Farmer registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);

        // Duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This mobile number is already registered"
            });
        }

        // Mongoose validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

// ==============================
// Farmer Login
// ==============================
const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Check required fields
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone and password are required"
            });
        }

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        // Find farmer by phone
        const user = await User.findOne({
            phone: phone.trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone or password"
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone or password"
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// Export both controllers
module.exports = { registerUser, loginUser };
