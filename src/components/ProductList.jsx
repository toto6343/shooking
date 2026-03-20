import React, { useState } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';

const ProductList = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  const categories = ['전체', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === '전체' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <h2 className={styles.title}>{selectedCategory} 신상품</h2>
      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
