import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites, addToFavoritesAsync, removeFromFavoritesAsync } from "../slices/favoritesSlice";
import { addToCartAsync } from "../slices/cartSlice";
import { FiHeart,  FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "../styles/ProductCard.module.css";
import fallbackImage from "../assets/Product1.png";

const ProductCard = ({ product, showRemoveButton = false }) => {
    const dispatch = useDispatch();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [buttonState, setButtonState] = useState('default'); // 'default', 'adding', 'added'
    const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    const isLiked = favoriteItems.some((item) => item._id === product._id);
    const cartItem = cartItems.find((item) => item._id === product._id);
    const isInCart = !!cartItem;

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated) {
            // Fallback to localStorage for non-authenticated users
            if (isLiked) {
                dispatch(removeFromFavorites(product._id));
            } else {
                dispatch(addToFavorites(product));
            }
            return;
        }
        
        try {
            if (isLiked) {
                await dispatch(removeFromFavoritesAsync(product._id));
            } else {
                await dispatch(addToFavoritesAsync(product));
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
            // Fallback to local action if API fails
            if (isLiked) {
                dispatch(removeFromFavorites(product._id));
            } else {
                dispatch(addToFavorites(product));
            }
        }
    };

    // const handleRemove = async (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
        
    //     if (!isAuthenticated) {
    //         dispatch(removeFromFavorites(product._id));
    //         return;
    //     }
        
    //     try {
    //         await dispatch(removeFromFavoritesAsync(product._id));
    //     } catch (error) {
    //         console.error('Error removing from favorites:', error);
    //         // Fallback to local action if API fails
    //         dispatch(removeFromFavorites(product._id));
    //     }
    // };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsAddingToCart(true);
        setButtonState('adding');
        
        try {
            await dispatch(addToCartAsync({ product, quantity: 1 }));
            setButtonState('added');
            
            // Reset button state after animation
            setTimeout(() => {
                setButtonState('default');
            }, 600);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setButtonState('default');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const truncateText = (text, wordLimit = 8) => {
        if (!text) return "";
        const words = text.split(" ");
        if (words.length <= wordLimit) return text;
        return words.slice(0, 8).join(' ') + '...';
    };

    const getImageSrc = () => {
        if (product.img) return product.img;
        if (product.images && product.images.length > 0) return product.images[0];
        return fallbackImage;
    };

    const handleImageError = (e) => {
        e.target.src = fallbackImage;
    };

    const formatPrice = (price) => {
        if (!price) return "₹0";
        return `₹${price.toLocaleString("en-IN")}`;
    };

    return (
        <div className={styles.card}>
            <Link to={`/product/${product._id}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                    <img 
                        src={getImageSrc()} 
                        alt={product.name} 
                        onError={handleImageError}
                    />
                    
                    {/* Like button */}
                    <button 
                        className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`}
                        onClick={handleLikeToggle}
                        title={isLiked ? "Remove from favorites" : "Add to favorites"}
                    >
                        <FiHeart className={styles.heartIcon} />
                    </button>

                    

                    {product.discount && (
                        <span className={styles.discount}>-{product.discount}%</span>
                    )}
                    {product.isNew && (
                        <span className={styles.tag}>New</span>
                    )}
                </div>
                
                <div className={styles.info}>
                    <h3>{product.name}</h3>
                    <p>{truncateText(product.description)}</p>
                    <div className={styles.price}>
                        <span>{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                            <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
                        )}
                    </div>
                </div>
            </Link>
            
            {/* Add to Cart Button */}
            <div className={styles.cardActions}>
                <button 
                    className={`${styles.addToCartBtn} ${isInCart ? styles.inCart : ''} ${buttonState === 'adding' ? styles.adding : ''} ${buttonState === 'added' ? styles.added : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                >
                    <FiShoppingCart />
                    {isAddingToCart ? 'Adding...' : isInCart ? `In Cart (${cartItem?.quantity})` : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
