import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import Carousel from "../components/Carousel";
import styles from "../styles/HomePage.module.css";

const Home = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    return (
        <div className={styles.homePage}>
            <HeroSection />
            <CategorySection />
            <div className={styles.container}>
                <h2 className={styles.title}>Our Products</h2>
                <ProductGrid />
            </div>
            <div className={styles.container}>
                <h2 className={styles.title}>Share your setup with</h2>
                <h3 className={styles.hashtag}>#FurniroFurniture</h3>
                <Carousel />
            </div>
        </div>
    );
};

export default Home;
