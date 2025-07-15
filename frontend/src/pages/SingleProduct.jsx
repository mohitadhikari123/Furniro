import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/SingleProduct.module.css";
import ProductGrid from "../components/ProductGrid";
import { FaStar, FaStarHalfAlt, FaRegStar, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { Link } from "react-router-dom";
import { productApi } from "../services/productApi";
import image1 from "../assets/Product1.png";
import image2 from "../assets/MaskGroup.png";
import image3 from "../assets/LivingRoom.png";
import image4 from "../assets/MaskGroup.png";
import image5 from "../assets/LivingRoom.png";

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");

    // Scroll to top when product changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    // Default images fallback
    const defaultImages = [image1, image2, image3, image4, image5];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productData = await productApi.getProductById(id);
                setProduct(productData);
                // Set default selected size if sizes exist
                if (productData.sizes && productData.sizes.length > 0) {
                    setSelectedSize(productData.sizes[0]);
                }
            } catch (error) {
                setError(error.message);
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={i} className={styles.star} />
                ))}
                {hasHalfStar && <FaStarHalfAlt className={styles.star} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaRegStar key={i} className={styles.star} />
                ))}
            </>
        );
    };

    if (loading) {
        return (
            <div className={styles.productPage}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.productPage}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Error: {error}</p>
                    <button onClick={() => navigate('/shop')}>Back to Shop</button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.productPage}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Product not found</p>
                    <button onClick={() => navigate('/shop')}>Back to Shop</button>
                </div>
            </div>
        );
    }

    // Use product images if available, otherwise fallback to default images
    const productImages = product.images && product.images.length > 0 ? product.images : defaultImages;

    return (
        <div className={styles.productPage}>
            <nav className={styles.breadcrumbs}>
                <Link to="/" className={styles.link}>Home</Link>
                <span>&gt;</span>
                <Link to="/shop" className={styles.link}>Shop</Link>
                <span>&gt;</span>
                <span className={styles.active}>{product.name}</span>
            </nav>

            <div className={styles.productContainer}>
                <div className={styles.images}>
                    <div className={styles.imageList}>
                        {productImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={product.name}
                                onClick={() => setSelectedImage(index)}
                                style={{ border: selectedImage === index ? '2px solid #b89037' : 'none' }}
                            />
                        ))}
                    </div>
                    <div className={styles.mainImage}>
                        <img src={productImages[selectedImage]} alt={product.name} />
                    </div>
                </div>

                <div className={styles.details}>
                    <h1>{product.name}</h1>
                    <p className={styles.price}>Rs. {product.price.toLocaleString()}</p>
                    <div className={styles.ratings}>
                        {renderStars(product.ratings)}
                    </div>

                    <p className={styles.description}>{product.description}</p>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className={styles.options}>
                            <div className={styles.sizes}>
                                <h4>Size</h4>
                                <div className={styles.sizeBtnContainer}>
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={styles.sizeBtn + (selectedSize === size ? ' ' + styles.selectedSize : '')}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <div className={styles.quantity}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <button className={styles.cartBtn}>Add To Cart</button>
                        <button className={styles.compareBtn}>+ Compare</button>
                    </div>

                    <div className={styles.productInfo}>
                        <p><strong>SKU:</strong> {product._id}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        {product.tags && product.tags.length > 0 && (
                            <p><strong>Tags:</strong> {product.tags.join(", ")}</p>
                        )}
                        <p><strong>Share:</strong>
                            <span className={styles.shareIcons}>
                                <FaFacebookF />
                                <FaLinkedinIn />
                                <SiX />
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.relatedProducts}>
                <h2>Related Products</h2>
                <ProductGrid />
            </div>
        </div>
    );
};

export default SingleProduct;
