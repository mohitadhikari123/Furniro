import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProductGrid.module.css";
import Product1 from "../assets/Product1.png";
import ProductCard from "./ProductCard";
import { productApi } from "../services/productApi";

const ProductGrid = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const productsData = await productApi.getAllProducts();
                // Transform the data to match the expected format
                const transformedProducts = productsData.map(product => ({
                    id: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price.toLocaleString(),
                    img: product.images && product.images.length > 0 ? product.images[0] : Product1,
                    discount: product.discount,
                    tag: product.tag
                }));
                setProducts(transformedProducts);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.grid} ${styles.mobileHidden}`}>
                {products.map((product) => (
                    <div key={product.id} onClick={() => handleProductClick(product.id)} style={{ cursor: "pointer" }}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
            <button className={styles.cartBtn}>Show More</button>
        </div>
    );
};

export default ProductGrid;
