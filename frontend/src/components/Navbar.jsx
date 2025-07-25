import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiUser, FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { logoutUser } from "../slices/authSlice";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/furniroLogo.png";

const Navbar = ({ onCartClick, onFavoritesClick }) => {
    const cart = useSelector((state) => state.cart?.cartItems || []);
    const favorites = useSelector((state) => state.favorites?.favoriteItems || []);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Calculate total quantity of all items in cart
    const totalCartItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);

    const handleLogout = () => {
        dispatch(logoutUser());
        setShowUserMenu(false);
        navigate('/');
        window.location.reload();
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest(`.${styles.userMenu}`)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

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
                <li><Link to="/favorites">Favorites</Link></li>
                <li>About</li>
                <li>Contact</li>
            </ul>

            {/* Icons & Hamburger */}
            <div className={styles.icons}>
                <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FiX /> : <FiMenu />}
                </div>
                
                {/* User Authentication */}
                {isAuthenticated && user ? (
                    <div className={styles.userMenu}>
                        <div 
                            className={styles.userIcon} 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                            ) : (
                                <FiUser className={styles.icon} />
                            )}
                        </div>
                        {showUserMenu && (
                            <div className={styles.dropdown}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.name}</span>
                                    <span className={styles.userEmail}>{user.email}</span>
                                </div>
                                <button onClick={handleLogout} className={styles.logoutBtn}>
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className={styles.loginLink}>
                        <FiUser className={styles.icon} />
                    </Link>
                )}
                
                <FiSearch className={styles.icon} />
                
                {/* Favorites Icon */}
                <div className={styles.favoritesIcon} onClick={onFavoritesClick}>
                    <FiHeart className={styles.icon} />
                    {favorites.length > 0 && <span className={styles.favoritesCount}>{favorites.length}</span>}
                </div>

                {/* Cart Icon */}
                <div className={styles.cartIcon} onClick={onCartClick}>
                    <FiShoppingCart className={styles.icon} />
                    {totalCartItems > 0 && <span className={styles.cartCount}>{totalCartItems}</span>}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
