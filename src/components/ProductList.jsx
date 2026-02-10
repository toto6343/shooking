import React from 'react';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';

const ProductList = ({ products, cartItems, onToggleCart }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>신상품</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isInCart={cartItems.includes(product.id)}
            onToggleCart={onToggleCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
