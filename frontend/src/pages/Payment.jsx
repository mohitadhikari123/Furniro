import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '../slices/notificationSlice';
import { clearCart } from '../slices/cartSlice';
import { paymentApi } from '../services/paymentApi';
import { orderApi } from '../services/orderApi';
import styles from '../styles/Payment.module.css';
import { FiCreditCard, FiLock, FiCheck, FiX } from 'react-icons/fi';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    // Get order data from location state or sessionStorage
    const [orderData, setOrderData] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success', 'failed'
    const [paymentIntent, setPaymentIntent] = useState(null);
    const [orderId, setOrderId] = useState(null);
    
    // Dummy card form data
    const [cardData, setCardData] = useState({
        cardNumber: '4242424242424242', // Dummy Stripe test card
        expiryMonth: '12',
        expiryYear: '2025',
        cvc: '123',
        cardholderName: 'John Doe'
    });
    
    // UPI form data
    const [upiData, setUpiData] = useState({
        upiId: 'user@paytm'
    });
    
    // Get payment method from order data
    const paymentMethod = orderData?.paymentMethod || 'Stripe';

    useEffect(() => {
        // Try to get order data from location state first
        if (location.state?.orderData) {
            setOrderData(location.state.orderData);
            setTotalAmount(location.state.totalAmount || 0);
        } else {
            // Fallback to sessionStorage (from Checkout page)
            const checkoutData = sessionStorage.getItem('checkoutData');
            if (checkoutData) {
                try {
                    const parsedData = JSON.parse(checkoutData);
                    setOrderData(parsedData);
                    setTotalAmount(parsedData.totalAmount || 0);
                    // Clear sessionStorage after using it
                    sessionStorage.removeItem('checkoutData');
                } catch (error) {
                    console.error('Error parsing checkout data:', error);
                }
            }
        }
    }, [location.state]);

    const createOrder = useCallback(async () => {
        try {
            setLoading(true);
            const response = await orderApi.createOrder(orderData);
            setOrderId(response._id);
            
            // Create payment intent
            const paymentResponse = await paymentApi.createPaymentIntent(
                totalAmount,
                'inr',
                response._id
            );
            setPaymentIntent(paymentResponse.paymentIntent);
        } catch (error) {
            dispatch(showNotification({
                message: error.message || 'Failed to initialize payment',
                type: 'error'
            }));
            navigate('/checkout');
        } finally {
            setLoading(false);
        }
    }, [orderData, totalAmount, dispatch, navigate]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Redirect if not authenticated
        if (!isAuthenticated) {
            navigate('/login?redirect=checkout');
            return;
        }
        
        // Only proceed if we have order data
        if (orderData) {
            createOrder();
        }
    }, [isAuthenticated, orderData, navigate, createOrder]);
    
    // Separate useEffect to handle redirect when no order data is found
    useEffect(() => {
        // Give some time for sessionStorage check to complete
        const timer = setTimeout(() => {
            if (isAuthenticated && !orderData) {
                navigate('/checkout');
            }
        }, 100);
        
        return () => clearTimeout(timer);
    }, [isAuthenticated, orderData, navigate]);

    const handleInputChange = (field, value) => {
        setCardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const fillTestData = () => {
        setCardData({
            cardNumber: '4242424242424242',
            expiryMonth: '12',
            expiryYear: '2025',
            cvc: '123',
            cardholderName: 'John Doe'
        });
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const validateForm = () => {
        if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
            return 'Please enter a valid card number';
        }
        if (!cardData.expiryMonth || !cardData.expiryYear) {
            return 'Please enter expiry date';
        }
        if (!cardData.cvc || cardData.cvc.length < 3) {
            return 'Please enter a valid CVC';
        }
        if (!cardData.cardholderName.trim()) {
            return 'Please enter cardholder name';
        }
        return null;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        // Validate form based on payment method
        let validationError = null;
        if (paymentMethod === 'Stripe') {
            validationError = validateForm();
        } else if (paymentMethod === 'UPI') {
            if (!upiData.upiId || !upiData.upiId.includes('@')) {
                validationError = 'Please enter a valid UPI ID';
            }
        }
        
        if (validationError) {
            dispatch(showNotification({
                message: validationError,
                type: 'error'
            }));
            return;
        }

        setLoading(true);
        setPaymentStep('processing');

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (paymentMethod === 'UPI') {
                // Simulate UPI payment process
                const upiPaymentResult = {
                    success: true,
                    transactionId: `UPI${Date.now()}`,
                    upiId: upiData.upiId
                };

                if (upiPaymentResult.success) {
                    setPaymentStep('success');
                    
                    // Clear cart after successful payment
                    dispatch(clearCart());
                    
                    dispatch(showNotification({
                        message: 'UPI Payment successful! Your order has been confirmed.',
                        type: 'success'
                    }));
                    
                    // Redirect to orders page after 3 seconds
                    setTimeout(() => {
                        navigate('/orders');
                    }, 3000);
                } else {
                    throw new Error('UPI payment failed');
                }
            } else {
                // Confirm payment with dummy payment method ID for Stripe
                const paymentMethodId = `pm_dummy_${Date.now()}`;
                const response = await paymentApi.confirmPayment(
                    paymentIntent.id,
                    paymentMethodId,
                    orderId
                );

                if (response.success) {
                    setPaymentStep('success');
                    
                    // Clear cart after successful payment
                    dispatch(clearCart());
                    
                    dispatch(showNotification({
                        message: 'Payment successful! Your order has been confirmed.',
                        type: 'success'
                    }));
                    
                    // Redirect to orders page after 3 seconds
                    setTimeout(() => {
                        navigate('/orders');
                    }, 3000);
                } else {
                    throw new Error(response.message || 'Payment failed');
                }
            }
        } catch (error) {
            setPaymentStep('failed');
            dispatch(showNotification({
                message: error.message || 'Payment failed. Please try again.',
                type: 'error'
            }));
        } finally {
            setLoading(false);
        }
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

    const retryPayment = () => {
        setPaymentStep('form');
    };

    if (loading && !paymentIntent) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Initializing payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.paymentWrapper}>
                <div className={styles.header}>
                    <h1>Complete Your Payment</h1>
                    <div className={styles.securityBadge}>
                        <FiLock />
                        <span>Secure Payment</span>
                    </div>
                </div>

                <div className={styles.paymentContent}>
                    <div className={styles.paymentForm}>
                        {paymentStep === 'form' && (
                            <>
                                <div className={styles.testDataSection}>
                                    <div className={styles.testDataHeader}>
                                        <h3>Test Payment (Demo Mode)</h3>
                                        {paymentMethod === 'Stripe' && (
                                            <button 
                                                type="button" 
                                                className={styles.fillTestBtn}
                                                onClick={fillTestData}
                                            >
                                                Use Test Card Data
                                            </button>
                                        )}
                                        {paymentMethod === 'UPI' && (
                                            <button 
                                                type="button" 
                                                className={styles.fillTestBtn}
                                                onClick={() => setUpiData({upiId: 'user@paytm'})}
                                            >
                                                Use Test UPI ID
                                            </button>
                                        )}
                                    </div>
                                    <p className={styles.testNote}>
                                        This is a demo payment system. {paymentMethod === 'UPI' ? 'Use the test UPI ID or enter your own dummy UPI ID.' : 'Use the test card data or enter your own dummy values.'}
                                    </p>
                                </div>

                                <form onSubmit={handlePayment} className={styles.cardForm}>
                                    {paymentMethod === 'Stripe' && (
                                        <div className={styles.cardHeader}>
                                            <FiCreditCard className={styles.cardIcon} />
                                            <h3>Card Information</h3>
                                        </div>
                                    )}
                                    {paymentMethod === 'UPI' && (
                                        <div className={styles.cardHeader}>
                                            <FiCreditCard className={styles.cardIcon} />
                                            <h3>UPI Payment</h3>
                                        </div>
                                    )}

                                    {paymentMethod === 'Stripe' && (
                                        <>
                                            <div className={styles.formGroup}>
                                                <label>Card Number</label>
                                                <input
                                                    type="text"
                                                    value={formatCardNumber(cardData.cardNumber)}
                                                    onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                    required
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>Expiry Month</label>
                                                    <select
                                                        value={cardData.expiryMonth}
                                                        onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Month</option>
                                                        {Array.from({ length: 12 }, (_, i) => {
                                                            const month = (i + 1).toString().padStart(2, '0');
                                                            return (
                                                                <option key={month} value={month}>
                                                                    {month}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                
                                                <div className={styles.formGroup}>
                                                    <label>Expiry Year</label>
                                                    <select
                                                        value={cardData.expiryYear}
                                                        onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Year</option>
                                                        {Array.from({ length: 10 }, (_, i) => {
                                                            const year = (new Date().getFullYear() + i).toString();
                                                            return (
                                                                <option key={year} value={year}>
                                                                    {year}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                
                                                <div className={styles.formGroup}>
                                                    <label>CVC</label>
                                                    <input
                                                        type="text"
                                                        value={cardData.cvc}
                                                        onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                                                        placeholder="123"
                                                        maxLength="4"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Cardholder Name</label>
                                                <input
                                                    type="text"
                                                    value={cardData.cardholderName}
                                                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                    
                                    {paymentMethod === 'UPI' && (
                                        <div className={styles.formGroup}>
                                            <label>UPI ID</label>
                                            <input
                                                type="text"
                                                value={upiData.upiId}
                                                onChange={(e) => setUpiData({upiId: e.target.value})}
                                                placeholder="yourname@paytm"
                                                required
                                            />
                                            <small className={styles.upiNote}>
                                                Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)
                                            </small>
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        className={styles.payButton}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}
                                    </button>
                                </form>
                            </>
                        )}

                        {paymentStep === 'processing' && (
                            <div className={styles.processingState}>
                                <div className={styles.spinner}></div>
                                <h3>Processing Payment...</h3>
                                <p>Please wait while we process your payment securely.</p>
                            </div>
                        )}

                        {paymentStep === 'success' && (
                            <div className={styles.successState}>
                                <div className={styles.successIcon}>
                                    <FiCheck />
                                </div>
                                <h3>Payment Successful!</h3>
                                <p>Your order has been confirmed and you will receive an email confirmation shortly.</p>
                                <p className={styles.redirectNote}>Redirecting to your orders...</p>
                            </div>
                        )}

                        {paymentStep === 'failed' && (
                            <div className={styles.failedState}>
                                <div className={styles.failedIcon}>
                                    <FiX />
                                </div>
                                <h3>Payment Failed</h3>
                                <p>We couldn't process your payment. Please check your card details and try again.</p>
                                <button 
                                    className={styles.retryButton}
                                    onClick={retryPayment}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.orderSummary}>
                        <h3>Order Summary</h3>
                        <div className={styles.summaryContent}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal:</span>
                                <span>{formatPrice(totalAmount)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Total:</span>
                                <span>{formatPrice(totalAmount)}</span>
                            </div>
                        </div>
                        
                        {orderData && (
                            <div className={styles.shippingInfo}>
                                <h4>Shipping Address</h4>
                                <p>
                                    {orderData.shippingAddress?.streetAddress}<br />
                                    {orderData.shippingAddress?.city}, {orderData.shippingAddress?.province}<br />
                                    {orderData.shippingAddress?.country} - {orderData.shippingAddress?.postalCode}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;