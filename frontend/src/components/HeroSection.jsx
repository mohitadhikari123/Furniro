import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HeroSection.module.css";
import heroImg from "../assets/heroBackground.png";

const HeroSection = () => {
    const navigate = useNavigate();

    const handleBuyNowClick = () => {
        navigate('/shop');
    };

    return (
        <div className={styles.hero}>
            <img src={heroImg} alt="Hero" className={styles.heroImg} />

            <div className={styles.content}>
                <span className={styles.newArrival}>New Arrival</span>
                <h1>Discover Our New Collection</h1>
                <p>Experience the perfect blend of style, comfort, and craftsmanship.</p>
                <button className={styles.shopBtn} onClick={handleBuyNowClick}>BUY NOW</button>
            </div>
        </div>
    );
};

export default HeroSection;
