import React from 'react';
import styles from '../styles/Popup.module.css';

const Popup = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;