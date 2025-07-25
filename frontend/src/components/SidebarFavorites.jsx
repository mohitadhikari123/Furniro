import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromFavorites, removeFromFavoritesAsync } from "../slices/favoritesSlice";
import styles from "../styles/SidebarFavorites.module.css";
import { FiX, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const SidebarFavorites = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const sidebarRef = useRef(null);

    // Handle click outside to close sidebar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleRemoveFromFavorites = async (productId) => {
        if (!isAuthenticated) {
            dispatch(removeFromFavorites(productId));
            return;
        }
        
        try {
            await dispatch(removeFromFavoritesAsync(productId));
        } catch (error) {
            console.error('Error removing from favorites:', error);
            // Fallback to local action if API fails
            dispatch(removeFromFavorites(productId));
        }
    };

    const getImageSrc = (product) => {
        if (product.img) return product.img;
        if (product.images && product.images.length > 0) return product.images[0];
        return '/placeholder-image.jpg';
    };

    return (
        <div ref={sidebarRef} className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
            <div className={styles.header}>
                <h2>Your Favorites ({favoriteItems.length})</h2>
                <button onClick={onClose} className={styles.closeBtn}>
                    <FiX />
                </button>
            </div>

            <div className={styles.favoritesContent}>
                {favoriteItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No favorites yet</p>
                        <span>Add products to your favorites to see them here!</span>
                    </div>
                ) : (
                    favoriteItems.map((item) => (
                        <div key={item._id} className={styles.favoriteItem}>
                            <Link to={`/product/${item._id}`} onClick={onClose}>
                                <img 
                                    src={getImageSrc(item)} 
                                    alt={item.name} 
                                    className={styles.itemImage} 
                                />
                            </Link>
                            <div className={styles.itemDetails}>
                                <Link to={`/product/${item._id}`} onClick={onClose}>
                                    <h4>{item.name}</h4>
                                </Link>
                                <p className={styles.price}>
                                    ₹{item.price?.toLocaleString("en-IN") || "0"}
                                </p>
                            </div>
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemoveFromFavorites(item._id)}
                                title="Remove from favorites"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {favoriteItems.length > 0 && (
                <div className={styles.favoritesFooter}>
                    <Link to="/favorites" onClick={onClose}>
                        <button className={styles.viewAllBtn}>View All Favorites</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SidebarFavorites;