import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productsApi';
import styles from './RecentlyViewed.module.css';

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const recentItems = useMemo(() => {
    const storedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (!allProducts || storedIds.length === 0) return [];
    
    // Get full product data for stored IDs, maintaining order
    return storedIds
      .map(id => allProducts.find(p => p.id === Number(id)))
      .filter(Boolean)
      .slice(0, 5);
  }, [allProducts]);

  if (recentItems.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>최근 본 상품</h3>
      <div className={styles.list}>
        {recentItems.map(item => (
          <div 
            key={item.id} 
            className={styles.item}
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.name} className={styles.image} />
            </div>
            <div className={styles.info}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.price}>{item.price.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
