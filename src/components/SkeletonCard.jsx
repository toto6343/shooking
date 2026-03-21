import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div className={`${styles.imageWrapper} ${styles.shimmer}`}></div>
      <div className={styles.content}>
        <div className={`${styles.brand} ${styles.shimmer}`}></div>
        <div className={`${styles.name} ${styles.shimmer}`}></div>
        <div className={`${styles.price} ${styles.shimmer}`}></div>
        <div className={`${styles.button} ${styles.shimmer}`}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
