
const Product = require("../model/Product");

// Add New Product (Admin)
const addProduct = async (req, res) => {
    try {
        const {
            name, category, description, price, stock, image
        } = req.body;

        if (!name || !category || !description || price === undefined || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required product details"
            });
        }

        const product = await Product.create({
            name, category, description, price, stock, image
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });
    } catch (error) {
        console.error("Add Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add product"
        });
    }
};

// Get All Products (Farmer)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isAvailable: true
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalProducts: products.length,
            products
        });
    } catch (error) {
        console.error("Get Products Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};

// Update Product (Admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};

// Delete Product (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
};
