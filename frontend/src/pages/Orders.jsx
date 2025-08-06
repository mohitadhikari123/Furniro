import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { orderApi } from "../services/orderApi";
import FeaturesSection from "../components/FeaturesSection";
import styles from "../styles/Orders.module.css";
import Product1 from "../assets/MaskGroup.png";

const Orders = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Redirect if not authenticated
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        fetchOrders();
    }, [isAuthenticated, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getUserOrders();
            // Sort orders by creation date in descending order (newest first)
            const sortedOrders = (response || []).sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
        } catch (error) {
            setError(error.message || 'Failed to fetch orders');
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return '#f39c12';
            case 'confirmed':
                return '#3498db';
            case 'shipped':
                return '#9b59b6';
            case 'out for delivery':
                return '#e67e22';
            case 'delivered':
                return '#27ae60';
            case 'cancelled':
                return '#e74c3c';
            default:
                return '#95a5a6';
        }
    };

    const getDeliveryProgress = (order) => {
        const steps = [
            { key: 'orderPlaced', label: 'Order Placed', status: true },
            { key: 'confirmed', label: 'Confirmed', status: order.deliveryTracking?.confirmed?.status || order.orderStatus === 'Confirmed' || ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) },
            { key: 'shipped', label: 'Shipped', status: order.deliveryTracking?.shipped?.status || order.orderStatus === 'Shipped' || ['Out for Delivery', 'Delivered'].includes(order.orderStatus) },
            { key: 'outForDelivery', label: 'Out for Delivery', status: order.deliveryTracking?.outForDelivery?.status || order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered' },
            { key: 'delivered', label: 'Delivered', status: order.deliveryTracking?.delivered?.status || order.orderStatus === 'Delivered' }
        ];
        return steps;
    };

    const DeliveryTracker = ({ order }) => {
        const steps = getDeliveryProgress(order);
        
        return (
            <div className={styles.deliveryTracker}>
                <h4>Delivery Status</h4>
                <div className={styles.progressContainer}>
                    {steps.map((step, index) => (
                        <div key={step.key} className={styles.progressStep}>
                            <div className={`${styles.stepIndicator} ${step.status ? styles.completed : ''}`}>
                                {step.status ? '✓' : index + 1}
                            </div>
                            <div className={styles.stepLabel}>
                                <span className={step.status ? styles.completedLabel : ''}>{step.label}</span>
                                {step.status && order.deliveryTracking?.[step.key]?.timestamp && (
                                    <small className={styles.stepTime}>
                                        {formatDate(order.deliveryTracking[step.key].timestamp)}
                                    </small>
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`${styles.progressLine} ${step.status ? styles.completedLine : ''}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className={styles.ordersPage}>
            <div className={styles.banner}>
                <img src={Product1} alt="Orders Banner" className={styles.bannerImg} />
                <div className={styles.bannerContent}>
                    <h1>My Orders</h1>
                    <p>Home &gt; Orders</p>
                </div>
            </div>

            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading your orders...</p>
                    </div>
                ) : error ? (
                    <div className={styles.error}>
                        <h3>Error Loading Orders</h3>
                        <p>{error}</p>
                        <button onClick={fetchOrders} className={styles.retryBtn}>
                            Try Again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>No Orders Found</h3>
                        <p>You haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/shop')} className={styles.shopBtn}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className={styles.ordersContainer}>
                        <h2>Your Order History</h2>
                        
                        <div className={styles.ordersList}>
                            {orders.map((order) => (
                                <div key={order._id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderInfo}>
                                            <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                                            <p className={styles.orderDate}>
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className={styles.orderStatus}>
                                            <span 
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                            >
                                                {order.orderStatus || 'Processing'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.orderDetails}>
                                        <div className={styles.shippingInfo}>
                                            <h4>Shipping Address</h4>
                                            <p>
                                                {order.shippingAddress?.streetAddress}<br />
                                                {order.shippingAddress?.city}, {order.shippingAddress?.province}<br />
                                                {order.shippingAddress?.country} - {order.shippingAddress?.postalCode}
                                            </p>
                                        </div>
                                        
                                        <div className={styles.paymentInfo}>
                                            <h4>Payment Method</h4>
                                            <p>{order.paymentMethod || 'Cash On Delivery'}</p>
                                            <p className={styles.paymentStatus}>
                                                Status: {order.paymentStatus || 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <DeliveryTracker order={order} />
                                    
                                    <div className={styles.orderItems}>
                                        <h4>Items Ordered</h4>
                                        <div className={styles.itemsList}>
                                            {order.orderItems?.map((item, index) => (
                                                <div key={index} className={styles.orderItem}>
                                                    <div className={styles.itemImage}>
                                                        <img 
                                                            src={item.product?.images?.[0] || '/placeholder-image.jpg'} 
                                                            alt={item.product?.name || 'Product'}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={styles.itemDetails}>
                                                        <h5>{item.product?.name || 'Product Name'}</h5>
                                                        <p>Quantity: {item.quantity}</p>
                                                        <p className={styles.itemPrice}>
                                                            {formatPrice(item.product?.price || 0)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.orderSummary}>
                                        <div className={styles.summaryRow}>
                                            <span>Subtotal:</span>
                                            <span>{formatPrice(order.subtotal || 0)}</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Shipping:</span>
                                            <span>Free</span>
                                        </div>
                                        <div className={`${styles.summaryRow} ${styles.total}`}>
                                            <span>Total:</span>
                                            <span>{formatPrice(order.totalAmount || 0)}</span>
                                        </div>
                                    </div>
                                    
                                    {order.additionalInfo && (
                                        <div className={styles.additionalInfo}>
                                            <h4>Additional Notes</h4>
                                            <p>{order.additionalInfo}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <FeaturesSection variant="compact" />
        </div>
    );
};

export default Orders;