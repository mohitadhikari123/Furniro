import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Left Section */}
                <div className={styles.left}>
                    <h2>Furniro.</h2>
                    <p>400 University Drive Suite 200 Coral Gables,</p>
                    <p>FL 33134 USA</p>
                </div>

                {/* Links Section */}
                <div className={styles.links}>
                    <h3>Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/">Shop</a></li>
                        <li><a href="/">About</a></li>
                        <li><a href="/">Contact</a></li>
                    </ul>
                </div>

                {/* Help Section */}
                <div className={styles.help}>
                    <h3>Help</h3>
                    <ul>
                        <li><a href="/">Payment Options</a></li>
                        <li><a href="/">Returns</a></li>
                        <li><a href="/">Privacy Policies</a></li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div className={styles.newsletter}>
                    <h3 className={styles.newsletterheading}>Newsletter</h3>
                    <div className={styles.subscribe}>
                        <input type="email" placeholder="Enter Your Email Address" />
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.bottom}>
                <p>© 2025 Furniro. All rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
