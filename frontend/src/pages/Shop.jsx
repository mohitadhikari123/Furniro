import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/Shop.module.css";
import ProductGrid from "../components/ProductGrid";
import FeaturesSection from "../components/FeaturesSection";
import Product1 from "../assets/MaskGroup.png";

const Shop = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [searchParams, category, searchQuery]);

    const getPageTitle = () => {
        if (searchQuery) {
            return `Search Results`;
        }
        if (category) {
            return `${category} Collection`;
        }
        return "Shop";
    };

    const getBreadcrumb = () => {
        if (searchQuery) {
            return `Home > Shop > Search: "${searchQuery}"`;
        }
        if (category) {
            return `Home > Shop > ${category}`;
        }
        return "Home > Shop";
    };

    return (
        <div className={styles.shopPage}>

            <div className={styles.banner}>
                <img src={Product1} alt="Shop Banner" className={styles.bannerImg} />
                <h1>{getPageTitle()}</h1>
                <p>{getBreadcrumb()}</p>
            </div>

            <ProductGrid key={`${category || 'all'}-${searchQuery || 'none'}`} category={category} searchQuery={searchQuery} showAll={true} />

            <FeaturesSection variant="default" />

        </div>
    );
};

export default Shop;
