import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api/productsApi';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const [wishlistIds, setWishlistIds] = useState([]);
  
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  useEffect(() => {
    const loadWishlist = () => {
      const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistIds(stored);
    };

    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);

  const wishedProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(p => wishlistIds.includes(p.id));
  }, [allProducts, wishlistIds]);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>위시리스트 | 슈킹 SHOOKING</title>
      </Helmet>
      
      <h1 className={styles.title}>위시리스트</h1>
      
      <AnimatePresence mode="popLayout">
        {wishedProducts.length > 0 ? (
          <motion.div 
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {wishedProducts.map(product => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : !isLoading && (
          <motion.div 
            className={styles.empty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.emptyIcon}>♡</div>
            <p>위시리스트가 비어 있습니다.</p>
            <p className={styles.emptySub}>마음에 드는 상품을 담아보세요!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
