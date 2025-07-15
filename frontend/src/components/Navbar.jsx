import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiUser, FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/furniroLogo.png";

const Navbar = ({ onCartClick }) => {
    const cart = useSelector((state) => state.cart.cartItems);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            {/* Logo & Brand */}
            <div className={styles.left}>
                <Link to="/">
                    <img src={logo} alt="Furniro Logo" className={styles.logo} />
                    <span className={styles.brand}>Furniro</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li>About</li>
                <li>Contact</li>
            </ul>

            {/* Icons & Hamburger */}
            <div className={styles.icons}>
                <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FiX /> : <FiMenu />}
                </div>
                <FiUser className={styles.icon} />
                <FiSearch className={styles.icon} />
                <FiHeart className={styles.icon} />

                {/* Cart Icon */}
                <div className={styles.cartIcon} onClick={onCartClick}>
                    <FiShoppingCart className={styles.icon} />
                    {cart.length > 0 && <span className={styles.cartCount}>{cart.length}</span>}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
