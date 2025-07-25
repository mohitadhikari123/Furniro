import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCartAsync, updateQuantity } from "../slices/cartSlice";
import styles from "../styles/Cart.module.css";
import Product1 from "../assets/MaskGroup.png";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCartAsync(productId));
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCartAsync(productId));
        } else {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const itemPrice = parseItemPrice(item);
            const quantity = item.quantity || 0;
            return total + (itemPrice * quantity);
        }, 0);
    };

    const formatPrice = (price) => {
        const numericPrice = parseFloat(price) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numericPrice);
    };

    const parseItemPrice = (item) => {
        const rawPrice = item.price || item.product?.price || 0;
        if (typeof rawPrice === 'string') {
            // Remove currency symbols, commas, and other non-numeric characters
            const cleanPrice = rawPrice.replace(/[^0-9.]/g, '');
            const parsedPrice = parseFloat(cleanPrice);
            return isNaN(parsedPrice) ? 0 : parsedPrice;
        }
        const numericPrice = parseFloat(rawPrice);
        return isNaN(numericPrice) ? 0 : numericPrice;
    };

    return (
        <div className={styles.cartPage}>
            <div className={styles.banner}>
                <img src={Product1} alt="Cart Banner" className={styles.bannerImg} />
                <h1>Shopping Cart</h1>
                <p>Home &gt; Cart</p>
            </div>

            <div className={styles.container}>
                {cartItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>Your cart is empty</h2>
                        <p>Start shopping to add products to your cart!</p>
                        <Link to="/shop" className={styles.shopButton}>
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.title}>Your Cart ({cartItems.length} items)</h2>
                        
                        <div className={styles.cartContent}>
                            <div className={styles.cartItems}>
                                {cartItems.map((item) => {
                                    const itemPrice = parseItemPrice(item);
                                    const quantity = item.quantity || 0;
                                    
                                    return (
                                        <div key={item._id} className={styles.cartItem}>
                                            <div className={styles.itemImage}>
                                                <img 
                                                    src={item.img || item.images[0]} 
                                                    alt={item.name} 
                                                />
                                            </div>
                                            
                                            <div className={styles.itemDetails}>
                                                <h3 className={styles.itemName}>{item.name}</h3>
                                                <p className={styles.itemPrice}>{formatPrice(itemPrice)}</p>
                                                <p className={styles.itemCategory}>{item.category}</p>
                                            </div>
                                        
                                        <div className={styles.quantityControls}>
                                            <button 
                                                className={styles.quantityBtn}
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className={styles.quantity}>{item.quantity}</span>
                                            <button 
                                                className={styles.quantityBtn}
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>
                                        
                                            <div className={styles.itemTotal}>
                                                {formatPrice(itemPrice * quantity)}
                                            </div>
                                        
                                        <button 
                                            className={styles.removeBtn}
                                            onClick={() => handleRemoveFromCart(item._id)}
                                            title="Remove from cart"
                                        >
                                            <FiTrash2 />
                                        </button>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className={styles.cartSummary}>
                                <h3>Order Summary</h3>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(calculateSubtotal())}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total:</span>
                                    <span>{formatPrice(calculateSubtotal())}</span>
                                </div>
                                <Link to="/checkout" className={styles.checkoutBtn}>
                                    Proceed to Checkout
                                </Link>
                                <Link to="/shop" className={styles.continueShoppingBtn}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;