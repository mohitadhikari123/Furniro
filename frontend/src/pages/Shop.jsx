import React, { useEffect } from "react";
import styles from "../styles/Shop.module.css";
import ProductGrid from "../components/ProductGrid";
import Product1 from "../assets/MaskGroup.png";
import { LuTrophy, LuShieldCheck, LuTruck, LuHeadphones } from "react-icons/lu";

const Shop = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    return (
        <div className={styles.shopPage}>

            <div className={styles.banner}>
                <img src={Product1} alt="Shop Banner" className={styles.bannerImg} />
                <h1>Shop</h1>
                <p>Home &gt; Shop</p>
            </div>

            <ProductGrid />

            <div className={styles.features}>
                <div className={styles.feature}>
                    <LuTrophy className={styles.icon} />
                    <div>
                        <h3>High Quality</h3>
                        <p>crafted from top materials</p>
                    </div>
                </div>

                <div className={styles.feature}>
                    <LuShieldCheck className={styles.icon} />
                    <div>
                        <h3>Warranty Protection</h3>
                        <p>Over 2 years</p>
                    </div>
                </div>

                <div className={styles.feature}>
                    <LuTruck className={styles.icon} />
                    <div>
                        <h3>Free Shipping</h3>
                        <p>Order over 150 $</p>
                    </div>
                </div>

                <div className={styles.feature}>
                    <LuHeadphones className={styles.icon} />
                    <div>
                        <h3>24 / 7 Support</h3>
                        <p>Dedicated support</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Shop;
