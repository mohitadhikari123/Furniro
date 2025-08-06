import React, { useEffect } from "react";
import FeaturesSection from "../components/FeaturesSection";
import styles from "../styles/About.module.css";
import bannerImg from "../assets/MaskGroup.png";

const About = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    return (
        <div className={styles.aboutPage}>
            {/* Banner Section */}
            <div className={styles.banner}>
                <img src={bannerImg} alt="About Banner" className={styles.bannerImg} />
                <div className={styles.bannerContent}>
                    <h1>About Us</h1>
                    <p>Discover our story and passion for furniture</p>
                </div>
            </div>

            {/* About Content */}
            <div className={styles.container}>
                {/* Our Story Section */}
                <div className={styles.storySection}>
                    <div className={styles.storyContent}>
                        <h2>Our Story</h2>
                        <p>
                            Founded with a passion for creating beautiful living spaces, Furniro has been 
                            transforming homes across India for over a decade. We believe that furniture is 
                            more than just functional pieces – it's about creating memories, comfort, and 
                            expressing your unique style.
                        </p>
                        <p>
                            From our humble beginnings in Mumbai to becoming a trusted name in furniture 
                            retail, we've maintained our commitment to quality craftsmanship, innovative 
                            design, and exceptional customer service.
                        </p>
                    </div>
                    <div className={styles.storyImage}>
                        <div className={styles.imagePlaceholder}>
                            <span>🏠</span>
                            <p>Crafting Beautiful Homes Since 2010</p>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className={styles.missionVision}>
                    <div className={styles.missionCard}>
                        <div className={styles.cardIcon}>🎯</div>
                        <h3>Our Mission</h3>
                        <p>
                            To provide high-quality, stylish, and affordable furniture that transforms 
                            houses into homes. We strive to make beautiful living accessible to everyone 
                            while maintaining sustainable practices.
                        </p>
                    </div>
                    <div className={styles.visionCard}>
                        <div className={styles.cardIcon}>👁️</div>
                        <h3>Our Vision</h3>
                        <p>
                            To be India's most trusted furniture brand, known for innovation, quality, 
                            and customer satisfaction. We envision a future where every home reflects 
                            the personality and dreams of its inhabitants.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div className={styles.valuesSection}>
                    <h2>Our Values</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>⭐</div>
                            <h4>Quality First</h4>
                            <p>We use only the finest materials and employ skilled craftsmen to ensure every piece meets our high standards.</p>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>🌱</div>
                            <h4>Sustainability</h4>
                            <p>We're committed to eco-friendly practices, using sustainable materials and responsible manufacturing processes.</p>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>💡</div>
                            <h4>Innovation</h4>
                            <p>We continuously explore new designs and technologies to bring you furniture that's both beautiful and functional.</p>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>❤️</div>
                            <h4>Customer Care</h4>
                            <p>Your satisfaction is our priority. We provide exceptional service from selection to delivery and beyond.</p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className={styles.teamSection}>
                    <h2>Meet Our Team</h2>
                    <p className={styles.teamIntro}>
                        Behind every beautiful piece of furniture is a dedicated team of designers, 
                        craftsmen, and customer service professionals who share our passion for excellence.
                    </p>
                    <div className={styles.teamGrid}>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <span>👨‍💼</span>
                            </div>
                            <h4>Rajesh Kumar</h4>
                            <p>Founder & CEO</p>
                            <span>Leading with vision and passion</span>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <span>👩‍🎨</span>
                            </div>
                            <h4>Priya Sharma</h4>
                            <p>Head of Design</p>
                            <span>Creating beautiful and functional designs</span>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <span>👨‍🔧</span>
                            </div>
                            <h4>Amit Patel</h4>
                            <p>Production Manager</p>
                            <span>Ensuring quality in every detail</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <FeaturesSection variant="default" />
        </div>
    );
};

export default About;