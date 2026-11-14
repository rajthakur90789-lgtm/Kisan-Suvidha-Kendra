
const express = require("express");
const router = express.Router();

const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Admin: Add Product
router.post("/", protect, adminOnly, addProduct);

// Farmer: Get All Products
router.get("/", protect, getAllProducts);

// Admin: Update Product
router.put("/:id", protect, adminOnly, updateProduct);

// Admin: Delete Product
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
