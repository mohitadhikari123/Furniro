import React, { useEffect, useState } from "react";
import styles from "../styles/Carousel.module.css";

const images = [
    "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/12126185/pexels-photo-12126185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/963486/pexels-photo-963486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/276534/pexels-photo-276534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/923192/pexels-photo-923192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
];

const CarouselRow = ({ direction = 1 }) => {
    // Duplicate images for seamless loop
    const duplicatedImages = [...images, ...images];
    
    return (
        <div className={styles.row}>
            <div className={`${styles.slideTrack} ${direction === 1 ? styles.slideLeft : styles.slideRight}`}>
                {duplicatedImages.map((src, idx) => (
                    <div key={idx} className={styles.imageWrapper}>
                        <img src={src} alt="carousel" className={styles.image} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Carousel = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let loaded = 0;
        images.forEach((src) => {
            const img = new window.Image();
            img.src = src;
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded === images.length) setLoading(false);
            };
        });
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div className={styles.carouselWrapper}>
            <CarouselRow direction={1} />
            <CarouselRow direction={-1} />
        </div>
    );
};

export default Carousel;