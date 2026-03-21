import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../api/productsApi';
import { calculateCartTotal } from '../utils/cartUtils';
import styles from './Cart.module.css';

const Cart = ({ onCheckout }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity } = useCart();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  const cartItemsEntries = Object.entries(cartItems);
  const cartProducts = products ? cartItemsEntries.map(([itemKey, quantity]) => {
    const [productId, size] = itemKey.split('-');
    const product = products.find(p => p.id === Number(productId));
    return product ? { ...product, size, quantity, itemKey } : null;
  }).filter(Boolean) : [];
  
  const totalItemCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  
  const { totalAmount, shippingFee, finalAmount } = calculateCartTotal(cartItems, products || []);

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const accessories = [
    { id: 101, name: '프리미엄 스포츠 양말', price: 5000, image: 'https://images.unsplash.com/photo-1582966298431-99c6a1e8d44c?q=80&w=200&auto=format&fit=crop', brand: 'SHOOKING' },
    { id: 102, name: '신발 세척 키트', price: 12000, image: 'https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?q=80&w=200&auto=format&fit=crop', brand: 'SHOOKING' },
  ];

  return (
    <motion.div 
      className={styles.cartPage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>장바구니 | 슈킹 SHOOKING</title>
      </Helmet>

      <header className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>장바구니</h2>
          <p className={styles.subtitle}>현재 {totalItemCount}개의 상품이 담겨있습니다.</p>
        </div>

        {cartProducts.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>장바구니가 비어 있습니다.</p>
            <Link to="/" className={styles.goShopping}>쇼핑하러 가기</Link>
          </div>
        ) : (
          <>
            <ul className={styles.productList}>
              {cartProducts.map((item) => (
                <li key={item.itemKey} className={styles.productItem}>
                  <div className={styles.productImageWrapper}>
                    <img src={item.image} alt={`${item.brand} ${item.name}`} className={styles.productImage} />
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.infoTop}>
                      <p className={styles.brand}>{item.brand}</p>
                      <h3 className={styles.productName}>{item.name}</h3>
                      <p className={styles.productSize}>사이즈: {item.size}mm</p>
                    </div>
                    <p className={styles.productPrice}>{formatPrice(item.price)}원</p>
                    
                    <div className={styles.quantityControl} role="group" aria-label="수량 조절">
                      <button 
                        className={styles.qtyBtn} 
                        onClick={() => updateQuantity(item.itemKey, -1)}
                        aria-label="수량 감소"
                      >−</button>
                      <span className={styles.qtyValue} aria-live="polite">{item.quantity}</span>
                      <button 
                        className={styles.qtyBtn} 
                        onClick={() => updateQuantity(item.itemKey, 1)}
                        aria-label="수량 증가"
                      >+</button>
                    </div>
                  </div>
                  <button 
                    className={styles.removeButton} 
                    onClick={() => updateQuantity(item.itemKey, -item.quantity)}
                    aria-label={`${item.name} 삭제`}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.closeIcon} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>총 상품금액</span>
                <span>{formatPrice(totalAmount)}원</span>
              </div>
              <div className={styles.summaryRow}>
                <span>배송비</span>
                <span>{shippingFee === 0 ? '무료' : `${formatPrice(shippingFee)}원`}</span>
              </div>
              <div className={styles.divider}></div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>총 결제금액</span>
                <span className={styles.totalPrice}>{formatPrice(finalAmount)}원</span>
              </div>
              <button className={styles.checkoutButton} onClick={onCheckout}>
                결제하기
              </button>
            </div>

            <div className={styles.recommendationSection}>
              <h3 className={styles.recommendTitle}>함께 구매하면 좋은 상품</h3>
              <div className={styles.recommendGrid}>
                {accessories.map(item => (
                  <div key={item.id} className={styles.recommendCard}>
                    <img src={item.image} alt={item.name} className={styles.recommendImg} />
                    <div className={styles.recommendInfo}>
                      <p className={styles.recommendName}>{item.name}</p>
                      <p className={styles.recommendPrice}>{formatPrice(item.price)}원</p>
                      <button 
                        className={styles.addRecommendBtn}
                        onClick={() => {
                          // Simple mock add (no size needed for accessories)
                          updateQuantity(`${item.id}-F`, 1);
                        }}
                      >
                        추가
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
