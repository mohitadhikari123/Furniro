import React from "react";
import styles from "../styles/FeaturesSection.module.css";
import { LuTrophy, LuShieldCheck, LuTruck, LuHeadphones } from "react-icons/lu";

const FeaturesSection = ({ className = "", variant = "default" }) => {
    const features = [
        {
            icon: LuTrophy,
            title: "High Quality",
            description: "crafted from top materials"
        },
        {
            icon: LuShieldCheck,
            title: "Warranty Protection",
            description: "Over 2 years"
        },
        {
            icon: LuTruck,
            title: "Free Shipping",
            description: "Order over 150 $"
        },
        {
            icon: LuHeadphones,
            title: "24 / 7 Support",
            description: "Dedicated support"
        }
    ];

    return (
        <div className={`${styles.features} ${styles[variant]} ${className}`}>
            {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div key={index} className={styles.feature}>
                        <Icon className={styles.icon} />
                        <div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FeaturesSection;