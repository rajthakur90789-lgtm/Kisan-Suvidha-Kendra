
import { useEffect, useState } from "react";
import "../style/products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/products",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setProducts(
                        Array.isArray(data)
                            ? data
                            : data.products || data.data || []
                    );
                } else {
                    setError(data.message || "Products load nahi ho paye.");
                }
            } catch (error) {
                console.error("Products Error:", error);
                setError("Backend server connection failed.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <h2 className="products-message">Loading Products...</h2>;
    }

    if (error) {
        return <h2 className="products-message">{error}</h2>;
    }

    return (
        <div className="products-container">

            <div className="products-heading">
                <span>OUR AGRICULTURE STORE</span>
                <h1>Agriculture Products 🌱</h1>
                <p>Explore useful products for your farming needs.</p>
            </div>

            {products.length === 0 ? (
                <div className="empty-products">
                    <h2>No Products Available</h2>
                    <p>Products will be displayed here when added by Admin.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <div className="product-card" key={product._id}>
                            
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                />
                            ) : (
                                <div className="product-placeholder">
                                    🌾
                                </div>
                            )}

                            <div className="product-info">
                                <span className="product-category">
                                    {product.category}
                                </span>

                                <h3>{product.name}</h3>

                                <p>{product.description}</p>

                                <h3 className="product-price">
                                    ₹{product.price}
                                </h3>

                                <p>
                                    Stock: {product.stock}
                                </p>

                                <span className={
                                    product.isAvailable
                                        ? "available"
                                        : "unavailable"
                                }>
                                    {product.isAvailable
                                        ? "Available"
                                        : "Not Available"}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default Products;
