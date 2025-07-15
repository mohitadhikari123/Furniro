import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/ProductCard.module.css";

const truncateDescription = (desc) => {
    if (!desc) return '';
    const words = desc.split(' ');
    if (words.length <= 8) return desc;
    return words.slice(0, 8).join(' ') + '...';
};

const ProductCard = ({ product }) => {
    return (
        <div className={styles.card} style={{ height: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className={styles.imageWrapper} style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product.img} alt={product.name} style={{ maxHeight: '200px' }} />
                {product.discount && <span className={styles.discount}>{product.discount}</span>}
                {product.tag && <span className={styles.tag}>{product.tag}</span>}
            </div>

            <div className={styles.info} style={{ flex: 1 }}>
                <h3>{product.name}</h3>
                <p>{truncateDescription(product.description)}</p>
                <div className={styles.price}>
                    <span>₹{product.price}</span>
                    {product.oldPrice && <span className={styles.oldPrice}>₹{product.oldPrice}</span>}
                </div>
            </div>

            <div className={styles.overlay}>
                <button className={styles.cartBtn}>Add to cart</button>
                <div className={styles.actions}>
                    <span>Share</span>
                    <span>Compare</span>
                    <span>Like</span>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        oldPrice: PropTypes.string,
        img: PropTypes.string.isRequired,
        discount: PropTypes.string,
        tag: PropTypes.string,
    }).isRequired,
};

export default ProductCard;
