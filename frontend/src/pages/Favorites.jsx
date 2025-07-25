import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Favorites.module.css";
import Product1 from "../assets/MaskGroup.png";

const Favorites = () => {
    const favoriteItems = useSelector((state) => state.favorites.favoriteItems);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className={styles.favoritesPage}>
            <div className={styles.banner}>
                <img src={Product1} alt="Favorites Banner" className={styles.bannerImg} />
                <h1>Favorites</h1>
                <p>Home &gt; Favorites</p>
            </div>

            <div className={styles.container}>
                {favoriteItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>No favorites yet</h2>
                        <p>Start adding products to your favorites to see them here!</p>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.title}>Your Favorite Products ({favoriteItems.length})</h2>
                        <div className={styles.grid}>
                            {favoriteItems.map((product) => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                    showRemoveButton={true}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Favorites;