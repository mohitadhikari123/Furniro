import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { loginUser, clearError, setUser } from "../slices/authSlice";
import styles from "../styles/Auth.module.css";
import Product1 from "../assets/MaskGroup.png";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        dispatch(clearError()); // Clear error when user types
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleGoogleLogin = () => {
        // Open Google OAuth in a popup window
        const popup = window.open(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`,
            'google-auth',
            'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for messages from the popup
        const handleMessage = (event) => {
            if (event.origin !== (process.env.REACT_APP_API_URL || 'http://localhost:5000')) {
                return;
            }

            if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                const { token, user } = event.data;
                
                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Update Redux state
                dispatch(setUser(user));
                
                // Close popup and navigate
                popup.close();
                navigate('/');
                window.location.reload();
            } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
                console.error('Google authentication failed:', event.data.message);
                popup.close();
            }
        };

        window.addEventListener('message', handleMessage);

        // Clean up event listener when popup is closed
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                window.removeEventListener('message', handleMessage);
                clearInterval(checkClosed);
            }
        }, 1000);
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.banner}>
                <img src={Product1} alt="Login Banner" className={styles.bannerImg} />
                <h1>Login</h1>
                <p>Home &gt; Login</p>
            </div>

            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h2>Welcome Back</h2>
                    <p className={styles.subtitle}>Sign in to your account</p>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputWrapper}>
                                <FiMail className={styles.inputIcon} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputWrapper}>
                                <FiLock className={styles.inputIcon} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>or</span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className={styles.googleBtn}
                        disabled={loading}
                    >
                        <FcGoogle className={styles.googleIcon} />
                        Continue with Google
                    </button>

                    <p className={styles.authLink}>
                        Don't have an account?{" "}
                        <Link to="/register">Sign up here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;