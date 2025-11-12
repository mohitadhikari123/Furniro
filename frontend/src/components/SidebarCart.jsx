import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCartAsync, updateQuantity, syncCartWithBackend } from "../slices/cartSlice";
import styles from "../styles/SidebarCart.module.css";
import { FiX, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import fallbackImage from "../assets/Product1.png";

const SidebarCart = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, loading, error } = useSelector((state) => state.cart);
    const [itemLoading, setItemLoading] = useState({});
    const [showConfirmRemove, setShowConfirmRemove] = useState(null);
    const [notification, setNotification] = useState(null);

    // No automatic sync needed here - sync happens on login in App.jsx

    // Auto-hide notifications
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleRemoveFromCart = async (productId) => {
        setItemLoading(prev => ({ ...prev, [productId]: true }));
        try {
            await dispatch(removeFromCartAsync(productId)).unwrap();
            setNotification({ type: 'success', message: 'Item removed from cart' });
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to remove item' });
        } finally {
            setItemLoading(prev => ({ ...prev, [productId]: false }));
            setShowConfirmRemove(null);
        }
    };

    // const handleQuantityChange = async (productId, newQuantity) => {
    //     if (newQuantity <= 0) {
    //         setShowConfirmRemove(productId);
    //         return;
    //     }
        
    //     setItemLoading(prev => ({ ...prev, [productId]: true }));
    //     try {
    //         dispatch(updateQuantity({ productId, quantity: newQuantity }));
    //         setNotification({ type: 'success', message: 'Quantity updated' });
    //     } catch (error) {
    //         setNotification({ type: 'error', message: 'Failed to update quantity' });
    //     } finally {
    //         setItemLoading(prev => ({ ...prev, [productId]: false }));
    //     }
    // };

    const getImageSrc = (item) => {
        if (item.img) return item.img;
        if (item.images && item.images.length > 0) return item.images[0];
        return fallbackImage;
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const rawPrice = item.price || item.product?.price || 0;
        const price = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/,/g, '')) : rawPrice;
        const quantity = item.quantity || 0;
        return acc + (price * quantity);
    }, 0);

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className={styles.backdrop} onClick={onClose} />}
            
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`} role="dialog" aria-labelledby="cart-title">
                {/* Notification */}
                {notification && (
                    <div className={`${styles.notification} ${styles[notification.type]}`}>
                        {notification.message}
                    </div>
                )}

                <div className={styles.header}>
                    <h2 id="cart-title">Shopping Cart</h2>
                    <button 
                        onClick={onClose} 
                        className={styles.closeBtn}
                        aria-label="Close cart"
                    >
                        <FiX />
                    </button>
                </div>

                <div className={styles.cartContent}>
                    {loading && (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading your cart...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className={styles.error}>
                            <p>Error loading cart: {error}</p>
                            <button 
                                onClick={() => dispatch(syncCartWithBackend())}
                                className={styles.retryBtn}
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    
                    {!loading && !error && cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <FiShoppingCart className={styles.emptyIcon} />
                            <p>Your cart is empty</p>
                            <span>Add some products to get started!</span>
                        </div>
                    ) : (
                        cartItems.map((item) => {
                            const rawPrice = item.price || item.product?.price || 0;
                            const price = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/,/g, '')) : rawPrice;
                            const quantity = item.quantity || 0;

                            

                            
                            return (
                                <div key={item._id} className={styles.cartItem}>
                                    {/* Confirmation Modal */}
                                    {showConfirmRemove === item._id && (
                                        <div className={styles.confirmModal}>
                                            <p>Remove this item from cart?</p>
                                            <div className={styles.confirmButtons}>
                                                <button 
                                                    onClick={() => handleRemoveFromCart(item._id)}
                                                    className={styles.confirmBtn}
                                                    disabled={itemLoading[item._id]}
                                                >
                                                    Yes
                                                </button>
                                                <button 
                                                    onClick={() => setShowConfirmRemove(null)}
                                                    className={styles.cancelBtn}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div 
                                        className={styles.itemContent}
                                        onClick={() => {
                                            navigate(`/product/${item._id}`);
                                            onClose();
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img 
                                            src={getImageSrc(item)} 
                                            alt={item.name} 
                                            className={styles.itemImage}
                                            onError={(e) => { e.target.src = fallbackImage; }}
                                        />
                                        <div className={styles.itemInfo}>
                                            <h4 className={styles.itemName}>
                                                {item.name}
                                            </h4>
                                            <div className={styles.itemMeta}>
                                                <div className={styles.quantitySection}>
                                                    <span className={styles.quantityLabel}>{quantity}</span>
                                                    <span className={styles.multiplier}>X</span>
                                                    <span className={styles.unitPrice}>₹{price.toLocaleString("en-IN")}</span>
                                                </div>
                                                <div className={styles.totalPrice}>
                                                    ₹{(price * quantity).toLocaleString("en-IN")}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowConfirmRemove(item._id);
                                            }}
                                            disabled={itemLoading[item._id]}
                                            title="Remove from cart"
                                            aria-label={`Remove ${item.name} from cart`}
                                        >
                                            {itemLoading[item._id] ? (
                                                <div className={styles.miniSpinner}></div>
                                            ) : (
                                                <FiTrash2 />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {cartItems.length > 0 && (
                    <>
                        <div className={styles.cartSummary}>
                            <div className={styles.subtotal}>
                                <span className={styles.subtotalLabel}>Subtotal</span>
                                <span className={styles.subtotalAmount}>
                                    ₹{subtotal.toLocaleString("en-IN")}
                                </span>
                            </div>
                            
                            <div className={styles.cartActions}>
                                <button 
                                    className={styles.cartBtn}
                                    onClick={() => {
                                        navigate('/cart');
                                        onClose();
                                    }}
                                >
                                    Cart
                                </button>
                                <button className={styles.checkoutBtn} onClick={() => {
                                    navigate('/checkout');
                                    onClose();
                                }}>
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default SidebarCart;
