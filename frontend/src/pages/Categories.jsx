import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Categories.module.css";
import MaskGroup from "../assets/MaskGroup.png";

const allCategories = [
    { name: "Dining", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140136/furniro-products/orion-dining-set-1.jpg" },
    { name: "Living", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140123/furniro-products/vesta-coffee-table-1.jpg" },
    { name: "Bedroom", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140117/furniro-products/aurora-nightstand-1.jpg" },
    { name: "Office", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140485/furniro-products/executive-office-desk-1.jpg" },
    { name: "Kitchen", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140616/furniro-products/modern-kitchen-island-1.jpg" },
    { name: "Bathroom", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140746/furniro-products/bathroom-vanity-cabinet-1.jpg" },
    { name: "Outdoor", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141501/furniro-products/outdoor-dining-set-1.jpg" },
    { name: "Storage", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140996/furniro-products/storage-cabinet-1.jpg" },
    { name: "Decor", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141004/furniro-products/decorative-vase-1.jpg" },
    { name: "Sofas", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141245/furniro-products/3-seater-sofa-1.jpg" },
    { name: "Beds", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140221/furniro-products/serenity-bed-frame-1.jpg" },
    { name: "Dining Sets", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140136/furniro-products/orion-dining-set-1.jpg" },
    { name: "Study Tables", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141495/furniro-products/executive-study-table-1.jpg" },
    { name: "Centre Tables", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140123/furniro-products/vesta-coffee-table-1.jpg" },
    { name: "Recliners", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140160/furniro-products/nova-recliner-1.jpg" },
    { name: "Sectional Sofas", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140989/furniro-products/outdoor-sectional-sofa-1.jpg" },
    { name: "Wardrobes", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142299/furniro-products/3-door-wardrobe-1.jpg" },
    { name: "Cabinets & Sideboards", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142331/furniro-products/dining-room-sideboard-1.jpg" },
    { name: "Office Furniture", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140485/furniro-products/executive-office-desk-1.jpg" },
    { name: "Shoe Racks", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142364/furniro-products/5-tier-shoe-rack-1.jpg" },
    { name: "Bar Furniture", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142395/furniro-products/home-bar-counter-1.jpg" },
    { name: "Sofa Cum Beds", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142432/furniro-products/3-seater-sofa-cum-bed-1.jpg" },
    { name: "Bedside Tables", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140117/furniro-products/aurora-nightstand-1.jpg" },
    { name: "Crockery Units", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142497/furniro-products/glass-door-crockery-unit-1.jpg" },
    { name: "Book Shelves", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140129/furniro-products/nimbus-bookshelf-1.jpg" },
    { name: "Side Tables", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141497/furniro-products/round-side-table-1.jpg" },
    { name: "Chairs", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140142/furniro-products/celeste-armchair-1.jpg" },
    { name: "Sofa Chairs", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141251/furniro-products/accent-chair-1.jpg" },
    { name: "Dressing Tables", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141010/furniro-products/vanity-dressing-table-1.jpg" },
    { name: "Book Cases", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754140129/furniro-products/nimbus-bookshelf-1.jpg" },
    { name: "Stools & Pouffes", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754141002/furniro-products/storage-ottoman-1.jpg" },
    { name: "Gaming Chairs", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142749/furniro-products/racing-gaming-chair-1.jpg" },
    { name: "Bean Bags", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142780/furniro-products/large-bean-bag-1.jpg" },
    { name: "Massagers", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142812/furniro-products/full-body-massage-chair-1.jpg" },
    { name: "Trunks", img: "https://res.cloudinary.com/dxefljmbv/image/upload/v1754142845/furniro-products/vintage-storage-trunk-1.jpg" },
];

const Categories = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName) => {
        navigate(`/shop?category=${categoryName}`);
    };

    return (
        <div className={styles.categoriesPage}>
            {/* Banner Section */}
            <div className={styles.banner}>
                <img src={MaskGroup} alt="Categories Banner" className={styles.bannerImg} />
                <h1>Categories</h1>
                <p>Home &gt; Categories</p>
            </div>

            {/* Categories Grid */}
            <div className={styles.container}>
                <h2 className={styles.title}>Shop By Categories</h2>
                <div className={styles.grid}>
                    {allCategories.map((category, index) => (
                        <div 
                            key={index} 
                            className={styles.card}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <img src={category.img} alt={category.name} />
                            <h3>{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;