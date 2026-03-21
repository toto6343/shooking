import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import styles from './OrderSuccess.module.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Generate a random order number
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    setOrderNumber(`${date}-${randomNum}`);
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>주문 완료 | 슈킹 SHOOKING</title>
      </Helmet>

      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <div className={styles.iconWrapper}>
          <motion.div 
            className={styles.successIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            ✓
          </motion.div>
        </div>

        <h1 className={styles.title}>주문이 완료되었습니다!</h1>
        <p className={styles.subtitle}>슈킹을 이용해 주셔서 감사합니다. 곧 배송이 시작될 예정입니다.</p>
        
        <div className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span>주문 번호</span>
            <strong>{orderNumber}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>결제 수단</span>
            <span>카드 결제</span>
          </div>
          <div className={styles.infoRow}>
            <span>배송 예정</span>
            <span>2-3일 내 도착 예정</span>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Link to="/" className={styles.primaryButton}>쇼핑 계속하기</Link>
          <button onClick={() => navigate('/')} className={styles.secondaryButton}>주문 내역 확인</button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
