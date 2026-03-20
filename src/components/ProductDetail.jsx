import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, toggleCart } = useCart();
  
  const product = products.find((p) => p.id === parseInt(id));
  
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  const isInCart = !!cartItems[product.id];

  const relatedProducts = products
    .filter((p) => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price) => price.toLocaleString('ko-KR');

  return (
    <div className={styles.detailPage}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.icon}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={styles.title}>상품 상세</h2>
      </header>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.imageWrapper}>
            <img src={product.image} alt={product.name} className={styles.productImage} />
          </div>
          <div className={styles.infoWrapper}>
            <p className={styles.brand}>{product.brand}</p>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.category}>{product.category}</p>
            <p className={styles.price}>{formatPrice(product.price)}원</p>
            <div className={styles.description}>
              <h3>상품 설명</h3>
              <p>{product.description}</p>
            </div>
            <button 
              className={`${styles.cartButton} ${isInCart ? styles.active : ''}`}
              onClick={() => toggleCart(product.id)}
            >
              {isInCart ? '장바구니에서 제거' : '장바구니 담기'}
            </button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>연관 상품 추천</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <div 
                  key={p.id} 
                  className={styles.relatedCard}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={p.image} alt={p.name} className={styles.relatedImage} />
                  <p className={styles.relatedName}>{p.name}</p>
                  <p className={styles.relatedPrice}>{formatPrice(p.price)}원</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
