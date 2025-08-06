import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";
import Popup from "./Popup";

const Footer = () => {
    const [activePopup, setActivePopup] = useState(null);
    const [email, setEmail] = useState("");

    const openPopup = (popupType) => {
        setActivePopup(popupType);
    };

    const closePopup = () => {
        setActivePopup(null);
    };

    const handleSubscribe = () => {
        if (email.trim()) {
            openPopup('subscribe');
        } else {
            alert('Please enter a valid email address');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Left Section */}
                <div className={styles.left}>
                    <h2>Furniro.</h2>
                    <p>236 5th SE Avenue, New Delhi,</p>
                    <p>Delhi 110001, India</p>
                </div>

                {/* Links Section */}
                <div className={styles.links}>
                    <h3>Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Help Section */}
                <div className={styles.help}>
                    <h3>Help</h3>
                    <ul>
                        <li><button onClick={() => openPopup('payment')} className={styles.linkButton}>Payment Options</button></li>
                        <li><button onClick={() => openPopup('returns')} className={styles.linkButton}>Returns</button></li>
                        <li><button onClick={() => openPopup('privacy')} className={styles.linkButton}>Privacy Policies</button></li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div className={styles.newsletter}>
                    <h3 className={styles.newsletterheading}>Newsletter</h3>
                    <div className={styles.subscribe}>
                        <input 
                            type="email" 
                            placeholder="Enter Your Email Address" 
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <button onClick={handleSubscribe}>SUBSCRIBE</button>
                    </div>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.bottom}>
                <p>© 2025 Furniro. All rights reserved</p>
            </div>

            {/* Popups */}
            <Popup 
                isOpen={activePopup === 'payment'} 
                onClose={closePopup} 
                title="Payment Options"
            >
                <div>
                    <h3>Accepted Payment Methods</h3>
                    <ul>
                        <li>Credit Cards (Visa, MasterCard, American Express)</li>
                        <li>Debit Cards</li>
                        <li>PayPal</li>
                        <li>Bank Transfer</li>
                        <li>Cash on Delivery (COD)</li>
                        <li>UPI Payments</li>
                        <li>Net Banking</li>
                    </ul>
                    <p>All payments are processed securely through encrypted channels. We do not store your payment information on our servers.</p>
                </div>
            </Popup>

            <Popup 
                isOpen={activePopup === 'returns'} 
                onClose={closePopup} 
                title="Returns Policy"
            >
                <div>
                    <h3>Return Guidelines</h3>
                    <p><strong>Return Period:</strong> 30 days from delivery date</p>
                    <p><strong>Condition:</strong> Items must be unused, in original packaging</p>
                    
                    <h3>Return Process</h3>
                    <ul>
                        <li>Contact our customer service team</li>
                        <li>Provide order number and reason for return</li>
                        <li>Receive return authorization and shipping label</li>
                        <li>Pack items securely and ship back</li>
                        <li>Refund processed within 5-7 business days</li>
                    </ul>
                    
                    <p><strong>Note:</strong> Custom or personalized items cannot be returned unless defective.</p>
                </div>
            </Popup>

            <Popup 
                isOpen={activePopup === 'privacy'} 
                onClose={closePopup} 
                title="Privacy Policies"
            >
                <div>
                    <h3>Information We Collect</h3>
                    <ul>
                        <li>Personal information (name, email, address)</li>
                        <li>Payment information (processed securely)</li>
                        <li>Browsing behavior and preferences</li>
                        <li>Device and location information</li>
                    </ul>
                    
                    <h3>How We Use Your Information</h3>
                    <ul>
                        <li>Process orders and payments</li>
                        <li>Improve our services and user experience</li>
                        <li>Send promotional emails (with consent)</li>
                        <li>Provide customer support</li>
                    </ul>
                    
                    <h3>Data Protection</h3>
                    <p>We implement industry-standard security measures to protect your personal information. We never sell your data to third parties.</p>
                    
                    <p><strong>Contact us</strong> for any privacy-related questions or to request data deletion.</p>
                </div>
            </Popup>

            <Popup 
                isOpen={activePopup === 'subscribe'} 
                onClose={closePopup} 
                title="Newsletter Subscription"
            >
                <div>
                    <h3>Thank You for Subscribing!</h3>
                    <p>Your email <strong>{email}</strong> has been successfully added to our newsletter.</p>
                    
                    <h3>What to Expect</h3>
                    <ul>
                        <li>Weekly furniture trends and inspiration</li>
                        <li>Exclusive discounts and early access to sales</li>
                        <li>New product announcements</li>
                        <li>Home decor tips and guides</li>
                    </ul>
                    
                    <p>You can unsubscribe at any time by clicking the unsubscribe link in our emails.</p>
                </div>
            </Popup>
        </footer>
    );
};

export default Footer;
