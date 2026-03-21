import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './HotDeal.module.css';

const HotDeal = ({ product }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) return null;

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <span className={styles.fire}>🔥</span>
        <h3>타임 세일: 한정 수량</h3>
      </div>
      
      <div className={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
        <div className={styles.imageWrapper}>
          <img src={product.image} alt={product.name} className={styles.image} />
          <div className={styles.discount}>30% OFF</div>
        </div>
        
        <div className={styles.info}>
          <div className={styles.timer}>
            <span className={styles.timeUnit}>{String(timeLeft.hours).padStart(2, '0')}</span>:
            <span className={styles.timeUnit}>{String(timeLeft.minutes).padStart(2, '0')}</span>:
            <span className={styles.timeUnit}>{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className={styles.remaining}>남음</span>
          </div>
          <p className={styles.brand}>{product.brand}</p>
          <h4 className={styles.name}>{product.name}</h4>
          <div className={styles.priceRow}>
            <span className={styles.originalPrice}>{(product.price / 0.7).toLocaleString()}원</span>
            <span className={styles.salePrice}>{product.price.toLocaleString()}원</span>
          </div>
          <div className={styles.stockBar}>
            <div className={styles.stockProgress} style={{ width: '70%' }}></div>
            <span className={styles.stockLabel}>실시간 잔여 7개</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotDeal;
