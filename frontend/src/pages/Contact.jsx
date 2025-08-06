import React, { useState,useEffect } from "react";

import FeaturesSection from "../components/FeaturesSection";
import styles from "../styles/Contact.module.css";
import bannerImg from "../assets/MaskGroup.png";

const Contact = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setIsSubmitted(true);
        // Reset form data
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: ""
        });
    };

    const handleCloseModal = () => {
        setIsSubmitted(false);
    };

    return (
        <div className={styles.contactPage}>
            {/* Banner Section */}
            <div className={styles.banner}>
                <img src={bannerImg} alt="Contact Banner" className={styles.bannerImg} />
                <div className={styles.bannerContent}>
                    <h1>Contact</h1>
                    <p>Get in touch with us</p>
                </div>
            </div>

            {/* Contact Content */}
            <div className={styles.container}>
                <div className={styles.contactContent}>
                    {/* Contact Information */}
                    <div className={styles.contactInfo}>
                        <h2>Get In Touch With Us</h2>
                        <p>For More Information About Our Product & Services. Please Feel Free To Drop Us An Email. Our Staff Always Be There To Help You Out. Do Not Hesitate!</p>
                        
                        <div className={styles.infoItem}>
                            <div className={styles.icon}>📍</div>
                            <div>
                                <h3>Address</h3>
                                <p>236 5th SE Avenue, New Delhi,<br />Delhi 110001, India</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.icon}>📞</div>
                            <div>
                                <h3>Phone</h3>
                                <p>Mobile: +(91) 546-6789<br />Hotline: +(91) 456-6789</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.icon}>⏰</div>
                            <div>
                                <h3>Working Time</h3>
                                <p>Monday-Friday: 9:00 - 22:00<br />Saturday-Sunday: 9:00 - 21:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={styles.contactForm}>
                        <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Your name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Abc"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Abc@def.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="This is optional"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Hi! I'd like to ask about"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    Submit
                                </button>
                            </form>
                    </div>
                </div>

                {/* Features Section */}
            </div>
<FeaturesSection variant="default" />
            {/* Success Popup Modal */}
            {isSubmitted && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h3>Thank you for your message!</h3>
                            <p>We'll reply you shortly. Our team will get back to you within 24 hours.</p>
                            <button 
                                 className={styles.modalCloseBtn}
                                 onClick={handleCloseModal}
                             >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Contact;