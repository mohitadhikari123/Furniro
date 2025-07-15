import React from "react";
import styles from "../styles/CategorySection.module.css";
import LivingRoom from "../assets/LivingRoom.png";
import Dining from "../assets/Dining.png";
import MaskGroup from "../assets/MaskGroup.png";

const categories = [
    { name: "Dining", img: Dining },
    { name: "Living", img: LivingRoom },
    { name: "Bedroom", img: MaskGroup },
];

const CategorySection = () => {
    return (
        <div className={styles.categories}>
            <h2 className={styles.title}>Browse The Range</h2>
            <p className={styles.subtitle}>
                Discover our collection of stylish and comfortable home essentials.
            </p>
            <div className={styles.grid}>
                {categories.map((category, index) => (
                    <div key={index} className={styles.card}>
                        <img src={category.img} alt={category.name} />
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySection;
