import React from "react";
// import { useDispatch } from "react-redux";
// import {  useSelector } from "react-redux";
// import { removeFromCart, clearCart } from "../slices/cartSlice";
import styles from "../styles/SidebarCart.module.css";
import Product1 from "../assets/Product1.png";

const SidebarCart = ({ isOpen, onClose }) => {
    // const dispatch = useDispatch();

    // Static Products for Testing
    const staticCart = [
        {
            id: 1,
            name: "Asgaard sofa",
            image: Product1,
            quantity: 1,
            price: 250000
        },
        {
            id: 2,
            name: "Casaliving Wood",
            image: Product1,
            quantity: 1,
            price: 270000
        }
    ];

    const subtotal = staticCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // -----------------------------
    // 👇 DYNAMIC CODE (COMMENTED)
    // const cart = useSelector((state) => state.cart.cartItems);
    // const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // -----------------------------

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
            <div className={styles.header}>
                <h2>Shopping Cart</h2>
                <button onClick={onClose} className={styles.closeBtn}>×</button>
            </div>

            <div className={styles.cartContent}>
                {staticCart.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                        <div className={styles.itemDetails}>
                            <h4>{item.name}</h4>
                            <p>1 x <span className={styles.price}>Rs. {item.price.toLocaleString("en-IN")}.00</span></p>
                        </div>
                        <button
                            className={styles.removeBtn}
                            onClick={() => console.log(`Removing ${item.name}`)}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* Uncomment for Dynamic Code */}
                {/* 
                {cart.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                        <div className={styles.itemDetails}>
                            <h4>{item.name}</h4>
                            <p>{item.quantity} x <span className={styles.price}>Rs. {item.price.toLocaleString("en-IN")}.00</span></p>
                        </div>
                        <button
                            className={styles.removeBtn}
                            onClick={() => dispatch(removeFromCart(item.id))}
                        >
                            ×
                        </button>
                    </div>
                ))}
                */}
            </div>

            <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.totalPrice}>Rs. {subtotal.toLocaleString("en-IN")}.00</span>
            </div>

            <div className={styles.cartFooter}>
                <button className={styles.cartBtn}>Cart</button>
                <button className={styles.checkoutBtn}>Checkout</button>
                <button className={styles.compareBtn}>Comparison</button>
            </div>
        </div>
    );
};

export default SidebarCart;
