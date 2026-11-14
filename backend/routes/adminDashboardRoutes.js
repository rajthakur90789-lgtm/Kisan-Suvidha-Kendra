
const express = require("express");

const router = express.Router();

const { getDashboardStats } = require("../controllers/adminDashboardController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Admin Dashboard Statistics API
router.get(
    "/stats",
    protect,
    adminOnly,
    getDashboardStats
);

module.exports = router;
