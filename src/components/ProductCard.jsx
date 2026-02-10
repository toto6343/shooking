import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, isInCart, onToggleCart }) => {
  const handleClick = () => {
    onToggleCart(product.id);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatPrice(product.price)}원</p>
        
        <button 
          className={`${styles.button} ${isInCart ? styles.buttonActive : ''}`}
          onClick={handleClick}
        >
          {isInCart ? '담김' : '담기'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
