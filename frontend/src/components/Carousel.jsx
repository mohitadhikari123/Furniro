import React, { useEffect, useRef, useState } from "react";
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


const VISIBLE_COUNT = 5;
const SLIDE_INTERVAL = 2200; // ms (longer pause for smoothness)
const ANIMATION_DURATION = 900; // ms (gentler slide)

function getLoopedImages(arr, start, count) {
    const res = [];
    for (let i = 0; i < count; i++) {
        res.push(arr[(start + i + arr.length) % arr.length]);
    }
    return res;
}

const CarouselRow = ({ images, index, direction = 1 }) => {
    const [currentIndex, setCurrentIndex] = useState(index);
    const [sliding, setSliding] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const [position, setPosition] = useState(-1); // always start at -1
    const containerRef = useRef();
    const timeoutRef = useRef();
    const intervalRef = useRef();

    // Always render VISIBLE_COUNT+2 images for robust sliding
    // The visible images are always in the middle
    const slideImages = getLoopedImages(images, currentIndex - 1, VISIBLE_COUNT + 2);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSliding(true);
            setPosition(0); // animate to 0
            timeoutRef.current = setTimeout(() => {
                setSliding(false);
                setCurrentIndex((prev) => (direction === 1 ? (prev + 1) % images.length : (prev - 1 + images.length) % images.length));
                setPosition(-1); // instantly reset to -1 after animation
            }, ANIMATION_DURATION);
        }, SLIDE_INTERVAL);
        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
        };
    }, [images.length, direction]);

    const imageWidth = containerWidth / VISIBLE_COUNT;
    // Use position state to control transform
    const trackStyle = {
        width: `${(VISIBLE_COUNT + 2) * 100 / VISIBLE_COUNT}%`,
        transform: `translateX(${position * -direction * imageWidth}px)`,
        transition: sliding ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.77, 0, 0.175, 1)` : "none",
    };

    return (
        <div className={styles.row} ref={containerRef}>
            <div className={styles.slideTrack} style={trackStyle}>
                {slideImages.map((src, idx) => (
                    <div
                        key={direction + "-" + idx + src}
                        className={styles.imageWrapper}
                        style={{ width: imageWidth, minWidth: imageWidth }}
                    >
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
            <CarouselRow images={images} index={0} direction={1} />
            <CarouselRow images={images} index={0} direction={-1} />
        </div>
    );
};

export default Carousel; 