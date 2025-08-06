import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { registerUser, clearError, setUser } from "../slices/authSlice";
import styles from "../styles/Auth.module.css";
import Product1 from "../assets/MaskGroup.png";

const Register = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setValidationError(""); // Clear validation error when user types
        dispatch(clearError()); // Clear server error when user types
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setValidationError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            setValidationError("Password must be at least 6 characters long");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        dispatch(registerUser({
            name: formData.name,
            email: formData.email,
            password: formData.password
        }));
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
                <img src={Product1} alt="Register Banner" className={styles.bannerImg} />
                <h1>Register</h1>
                <p>Home &gt; Register</p>
            </div>

            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h2>Create Account</h2>
                    <p className={styles.subtitle}>Join us today and start shopping</p>

                    {(error || validationError) && (
                        <div className={styles.errorMessage}>
                            {error || validationError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputWrapper}>
                                <FiUser className={styles.inputIcon} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                            </div>
                        </div>

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

                        <div className={styles.inputGroup}>
                            <div className={styles.inputWrapper}>
                                <FiLock className={styles.inputIcon} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={styles.passwordToggle}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? "Creating account..." : "Create Account"}
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
                        Already have an account?{" "}
                        <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;