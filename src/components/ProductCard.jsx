import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, toggleCart } = useCart();
  const isInCart = !!cartItems[product.id];
  
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWished(wishlist.includes(product.id));
  }, [product.id]);

  const handleToggleCart = (e) => {
    e.stopPropagation();
    toggleCart(product.id, product.name);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updated;
    if (isWished) {
      updated = wishlist.filter(id => id !== product.id);
    } else {
      updated = [...wishlist, product.id];
    }
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setIsWished(!isWished);
    
    // Trigger storage event for other components (like Wishlist page)
    window.dispatchEvent(new Event('storage'));
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div 
      className={styles.card} 
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`${product.brand} ${product.name} 상세 보기`}
    >
      <div className={styles.imageWrapper}>
        <img 
          src={product.image} 
          alt={`${product.brand} ${product.name}`} 
          className={styles.image}
          loading="lazy"
        />
        <button 
          className={`${styles.wishButton} ${isWished ? styles.wished : ''}`}
          onClick={handleToggleWishlist}
          aria-label={isWished ? '위시리스트에서 제거' : '위시리스트에 담기'}
        >
          <svg fill={isWished ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" className={styles.heartIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className={styles.content}>
        <p className={styles.brand}>{product.brand}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatPrice(product.price)}원</p>
        
        <button 
          className={`${styles.button} ${isInCart ? styles.buttonActive : ''}`}
          onClick={handleToggleCart}
          aria-pressed={isInCart}
          aria-label={isInCart ? '장바구니에서 제거' : '장바구니에 담기'}
        >
          {isInCart ? '장바구니 담김 ✓' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
