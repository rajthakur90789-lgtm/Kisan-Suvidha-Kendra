
import { useEffect, useState } from "react";
import "../style/adminProducts.css";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        isAvailable: true
    });

    const token = localStorage.getItem("token");

    const fetchProducts = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Products load failed");
            }

            setProducts(
                Array.isArray(data)
                    ? data
                    : data.products || data.data || []
            );
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            description: "",
            price: "",
            stock: "",
            image: "",
            isAvailable: true
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `http://localhost:5000/api/products/${editingId}`
                : "http://localhost:5000/api/products";

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed");
            }

            alert(
                editingId
                    ? "Product Updated Successfully!"
                    : "Product Added Successfully!"
            );

            resetForm();
            fetchProducts();

        } catch (error) {
            alert(error.message);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);

        setFormData({
            name: product.name || "",
            category: product.category || "",
            description: product.description || "",
            price: product.price ?? "",
            stock: product.stock ?? "",
            image: product.image || "",
            isAvailable: product.isAvailable ?? true
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            alert("Product Deleted Successfully!");
            fetchProducts();

        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <h2>Loading Admin Products...</h2>;
    }

    return (
        <div className="admin-products-container">

            <h1>Admin Product Management</h1>
            <p>Add, Update and Manage Agriculture Products</p>

            <form className="admin-product-form" onSubmit={handleSubmit}>

                <h2>
                    {editingId ? "Update Product" : "Add New Product"}
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Product Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Product Price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Product Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <input
                    type="url"
                    name="image"
                    placeholder="Product Image URL"
                    value={formData.image}
                    onChange={handleChange}
                />

                <label className="availability-label">
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                    />
                    Product Available
                </label>

                <button type="submit">
                    {editingId ? "Update Product" : "Add Product"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={resetForm}
                    >
                        Cancel Edit
                    </button>
                )}

            </form>

            <h2 className="admin-list-heading">
                All Agriculture Products ({products.length})
            </h2>

            <div className="admin-products-grid">

                {products.map((product) => (
                    <div className="admin-product-card" key={product._id}>

                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                            />
                        ) : (
                            <div className="admin-product-placeholder">
                                🌾
                            </div>
                        )}

                        <div className="admin-product-info">

                            <h3>{product.name}</h3>

                            <p>Category: {product.category}</p>
                            <p>Price: ₹{product.price}</p>
                            <p>Stock: {product.stock}</p>

                            <span>
                                {product.isAvailable
                                    ? "Available"
                                    : "Not Available"}
                            </span>

                            <div className="admin-product-actions">

                                <button
                                    onClick={() => handleEdit(product)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default AdminProducts;
