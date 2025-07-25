import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../slices/notificationSlice';
import styles from '../styles/Notification.module.css';

const Notification = () => {
    const dispatch = useDispatch();
    const { message, type, isVisible } = useSelector((state) => state.notification);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                dispatch(hideNotification());
            }, 3000); // Hide after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [isVisible, dispatch]);

    if (!isVisible) return null;

    return (
        <div className={`${styles.notification} ${styles[type]}`}>
            <div className={styles.content}>
                <span className={styles.message}>{message}</span>
                <button 
                    className={styles.closeButton}
                    onClick={() => dispatch(hideNotification())}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification;