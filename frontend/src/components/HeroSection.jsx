import React from "react";
import styles from "../styles/HeroSection.module.css";
import heroImg from "../assets/heroBackground.png";

const HeroSection = () => {
    return (
        <div className={styles.hero}>
            <img src={heroImg} alt="Hero" className={styles.heroImg} />

            <div className={styles.content}>
                <span className={styles.newArrival}>New Arrival</span>
                <h1>Discover Our New Collection</h1>
                <p>Experience the perfect blend of style, comfort, and craftsmanship.</p>
                <button className={styles.shopBtn}>BUY NOW</button>
            </div>
        </div>
    );
};

export default HeroSection;
