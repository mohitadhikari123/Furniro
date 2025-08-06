import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CategorySection.module.css";
import { BiCategory } from "react-icons/bi";

const categories = [
    { name: "Dining", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140441/furniro-products/modern-pendant-light-3.jpg" },
    { name: "Living", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140177/furniro-products/bliss-rug-3.jpg" },
    { name: "Bedroom", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140257/furniro-products/slumber-storage-bench-1.jpg" },
];

const CategorySection = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName) => {
        navigate(`/shop?category=${categoryName}`);
    };

    const handleViewAllCategories = () => {
        navigate(`/categories`);
    };

    return (
        <div className={styles.categories}>
            <h2 className={styles.title}>Browse The Range</h2>
            <p className={styles.subtitle}>
                Discover our collection of stylish and comfortable home essentials.
            </p>
            


            <div className={styles.grid}>
                {categories.map((category, index) => (
                    <div 
                        key={index} 
                        className={styles.card}
                        onClick={() => handleCategoryClick(category.name)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={category.img} alt={category.name} />
                        <h3>{category.name}</h3>
                    </div>
                ))}
                <div 
                    className={`${styles.card} ${styles.viewAllCard} ${styles.minimalistBorder}`}
                    onClick={handleViewAllCategories}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.viewAllContent}>
                        <div className={styles.minimalistIcon}>
                            <BiCategory />
                        </div>
                        <h3>View All</h3>
                        <div className={styles.categoryCount}>25+ Categories</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySection;
