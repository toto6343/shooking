import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productsApi';
import styles from './Community.module.css';

const Community = () => {
  const [allSnaps, setAllSnaps] = useState([]);
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const mockCommunitySnaps = [
    { id: 1001, productId: 1, user: 'sneaker_head', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=400&auto=format&fit=crop', likes: 120, comment: '오늘 날씨랑 찰떡!' },
    { id: 1002, productId: 2, user: 'jordan_fan', image: 'https://images.unsplash.com/photo-1597043734183-bc6325459ec9?q=80&w=400&auto=format&fit=crop', likes: 85, comment: '역시 대장은 다르네' },
    { id: 1003, productId: 6, user: 'daily_look', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400&auto=format&fit=crop', likes: 64, comment: '편하게 신기 제일 좋아요' },
    { id: 1004, productId: 4, user: 'runner_01', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=400&auto=format&fit=crop', likes: 42, comment: '러닝 필수템 울트라부스트' },
  ];

  useEffect(() => {
    // Collect all snaps from localStorage for all products
    const keys = Object.keys(localStorage).filter(k => k.startsWith('snaps_'));
    const localSnaps = keys.flatMap(k => {
      const productId = k.replace('snaps_', '');
      const snaps = JSON.parse(localStorage.getItem(k) || '[]');
      return snaps.map(s => ({ ...s, productId }));
    });
    
    setAllSnaps([...localSnaps, ...mockCommunitySnaps]);
  }, []);

  const getProductName = (id) => {
    return products?.find(p => p.id === Number(id))?.name || '상품';
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>커뮤니티 | 슈킹 SHOOKING</title>
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>SHOOKING 커뮤니티</h1>
        <p className={styles.subtitle}>실시간 유저들의 스니커즈 스타일을 확인해보세요.</p>
      </div>

      <div className={styles.grid}>
        {allSnaps.map((snap, index) => (
          <motion.div 
            key={snap.id} 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.imageWrapper}>
              <img src={snap.image} alt="" className={styles.image} />
              <div className={styles.productBadge}>{getProductName(snap.productId)}</div>
            </div>
            <div className={styles.info}>
              <div className={styles.userRow}>
                <span className={styles.user}>@{snap.user}</span>
                <span className={styles.likes}>♥ {snap.likes}</span>
              </div>
              <p className={styles.comment}>{snap.comment}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Community;
