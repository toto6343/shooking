import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, toggleCart } = useCart();
  const isInCart = !!cartItems[product.id];

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleCart(product.id, product.name);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
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
          onClick={handleToggle}
        >
          {isInCart ? '담김' : '담기'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
