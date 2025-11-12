import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../services/orderApi";
import { clearCart } from "../slices/cartSlice";
import { showNotification } from "../slices/notificationSlice";
import FeaturesSection from "../components/FeaturesSection";
import styles from "../styles/Checkout.module.css";
import Product1 from "../assets/MaskGroup.png";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        billingDetails: {
            firstName: "",
            lastName: "",
            companyName: "",
            phone: "",
            email: ""
        },
        shippingAddress: {
            streetAddress: "",
            city: "",
            province: "",
            country: "India",
            postalCode: ""
        },
        paymentMethod: "Stripe",
        additionalInfo: ""
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Redirect if not authenticated
        if (!isAuthenticated) {
            navigate('/login?redirect=checkout');
            return;
        }
        
        // Redirect if cart is empty
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }
    }, [isAuthenticated, cartItems, navigate]);

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handlePaymentMethodChange = (method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: method
        }));
    };

    const parseItemPrice = (item) => {
        const rawPrice = item.price || item.product?.price || 0;
        if (typeof rawPrice === 'string') {
            const cleanPrice = rawPrice.replace(/[^0-9.]/g, '');
            const parsedPrice = parseFloat(cleanPrice);
            return isNaN(parsedPrice) ? 0 : parsedPrice;
        }
        const numericPrice = parseFloat(rawPrice);
        return isNaN(numericPrice) ? 0 : numericPrice;
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

    const validateForm = () => {
        const { billingDetails, shippingAddress } = formData;
        
        // Check required billing details
        if (!billingDetails.firstName || !billingDetails.lastName || 
            !billingDetails.phone || !billingDetails.email) {
            return "Please fill in all required billing details.";
        }
        
        // Check required shipping address
        if (!shippingAddress.streetAddress || !shippingAddress.city || 
            !shippingAddress.province || !shippingAddress.postalCode) {
            return "Please fill in all required shipping address fields.";
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(billingDetails.email)) {
            return "Please enter a valid email address.";
        }
        
        // Validate phone format (basic validation)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(billingDetails.phone.replace(/[^0-9]/g, ''))) {
            return "Please enter a valid 10-digit phone number.";
        }
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            dispatch(showNotification({
                message: validationError,
                type: 'error'
            }));
            return;
        }
        
        setLoading(true);
        
        try {
            const subtotal = calculateSubtotal();
            const orderData = {
                ...formData,
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                subtotal: subtotal,
                totalAmount: subtotal // No shipping charges for now
            };
            
            // If Stripe or UPI payment is selected, redirect to payment page
            if (formData.paymentMethod === 'Stripe' || formData.paymentMethod === 'UPI') {
                // Store order data in sessionStorage for payment page
                sessionStorage.setItem('checkoutData', JSON.stringify(orderData));
                navigate('/payment');
                return;
            }
            
            // For other payment methods, create order directly
            // const response = await orderApi.createOrder(orderData);
            
            // Clear cart after successful order
            dispatch(clearCart());
            
            dispatch(showNotification({
                message: 'Order placed successfully! Thank you for your purchase.',
                type: 'success'
            }));
            
            // Redirect to order confirmation or orders page
            navigate('/orders');
            
        } catch (error) {
            dispatch(showNotification({
                message: error.message || 'Failed to place order. Please try again.',
                type: 'error'
            }));
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || cartItems.length === 0) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className={styles.checkoutPage}>
            <div className={styles.banner}>
                <img src={Product1} alt="Checkout Banner" className={styles.bannerImg} />
                <h1>Checkout</h1>
                <p>Home &gt; Checkout</p>
            </div>

            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.checkoutForm}>
                    <div className={styles.formContent}>
                        <div className={styles.billingSection}>
                            <h2>Billing Details</h2>
                            
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.billingDetails.firstName}
                                        onChange={(e) => handleInputChange('billingDetails', 'firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.billingDetails.lastName}
                                        onChange={(e) => handleInputChange('billingDetails', 'lastName', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Company Name (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.billingDetails.companyName}
                                    onChange={(e) => handleInputChange('billingDetails', 'companyName', e.target.value)}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Country / Region *</label>
                                <select
                                    value={formData.shippingAddress.country}
                                    onChange={(e) => handleInputChange('shippingAddress', 'country', e.target.value)}
                                    required
                                >
                                    <option value="India">India</option>
                                    <option value="USA">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                </select>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Street Address *</label>
                                <input
                                    type="text"
                                    value={formData.shippingAddress.streetAddress}
                                    onChange={(e) => handleInputChange('shippingAddress', 'streetAddress', e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Town / City *</label>
                                <input
                                    type="text"
                                    value={formData.shippingAddress.city}
                                    onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Province *</label>
                                <select
                                    value={formData.shippingAddress.province}
                                    onChange={(e) => handleInputChange('shippingAddress', 'province', e.target.value)}
                                    required
                                >
                                    <option value="">Select Province</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                </select>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>ZIP Code *</label>
                                <input
                                    type="text"
                                    value={formData.shippingAddress.postalCode}
                                    onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    value={formData.billingDetails.phone}
                                    onChange={(e) => handleInputChange('billingDetails', 'phone', e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Email address *</label>
                                <input
                                    type="email"
                                    value={formData.billingDetails.email}
                                    onChange={(e) => handleInputChange('billingDetails', 'email', e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Additional Information</label>
                                <textarea
                                    value={formData.additionalInfo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                                    placeholder="Notes about your order, e.g. special notes for delivery."
                                    rows="4"
                                />
                            </div>
                        </div>
                        
                        <div className={styles.orderSummary}>
                            <h2>Your Order</h2>
                            
                            <div className={styles.orderItems}>
                                <div className={styles.orderHeader}>
                                    <span>Product</span>
                                    <span>Subtotal</span>
                                </div>
                                
                                {cartItems.map((item) => {
                                    const itemPrice = parseItemPrice(item);
                                    const quantity = item.quantity || 0;
                                    
                                    return (
                                        <div key={item._id} className={styles.orderItem}>
                                            <span className={styles.productName}>
                                                {item.name} × {quantity}
                                            </span>
                                            <span className={styles.productPrice}>
                                                {formatPrice(itemPrice * quantity)}
                                            </span>
                                        </div>
                                    );
                                })}
                                
                                <div className={styles.orderTotal}>
                                    <div className={styles.subtotalRow}>
                                        <span>Subtotal</span>
                                        <span>{formatPrice(calculateSubtotal())}</span>
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span>Total</span>
                                        <span className={styles.totalAmount}>{formatPrice(calculateSubtotal())}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.paymentSection}>
                                <h3>Payment Method</h3>
                                
                                <div className={styles.paymentOptions}>
                                    <div className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            id="stripe"
                                            name="payment"
                                            value="Stripe"
                                            checked={formData.paymentMethod === "Stripe"}
                                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        />
                                        <label htmlFor="stripe">Credit/Debit Card (Stripe)</label>
                                    </div>
                                    
                                    <div className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            id="upi"
                                            name="payment"
                                            value="UPI"
                                            checked={formData.paymentMethod === "UPI"}
                                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        />
                                        <label htmlFor="upi">UPI Payment</label>
                                    </div>
                                    
                                    <div className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            id="cash-delivery"
                                            name="payment"
                                            value="Cash On Delivery"
                                            checked={formData.paymentMethod === "Cash On Delivery"}
                                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        />
                                        <label htmlFor="cash-delivery">Cash on Delivery</label>
                                    </div>
                                </div>
                                
                                {formData.paymentMethod === "Stripe" && (
                                    <div className={styles.paymentInfo}>
                                        <p>Pay securely with your credit or debit card. Your payment information is encrypted and secure.</p>
                                    </div>
                                )}
                                
                                {formData.paymentMethod === "UPI" && (
                                    <div className={styles.paymentInfo}>
                                        <p>Pay instantly using UPI (Unified Payments Interface). You can use any UPI app like Google Pay, PhonePe, Paytm, or BHIM. This is a demo payment system for testing purposes.</p>
                                    </div>
                                )}
                                
                                {formData.paymentMethod === "Cash On Delivery" && (
                                    <div className={styles.paymentInfo}>
                                        <p>You can make your payment when you receive the order at your doorstep. Please keep exact change ready to avoid any inconvenience.</p>
                                    </div>
                                )}
                                
                                <div className={styles.privacyPolicy}>
                                    <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <strong>privacy policy</strong>.</p>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className={styles.placeOrderBtn}
                                    disabled={loading}
                                >
                                    {loading ? 'Placing Order...' : 'Place order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
            <FeaturesSection variant="compact" />
        </div>
    );
};

export default Checkout;