import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

const Cart = ({ products, onCheckout }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity } = useCart();
  
  const cartProductIds = Object.keys(cartItems).map(Number);
  const cartProducts = products.filter((product) => cartProductIds.includes(product.id));
  
  const totalAmount = cartProducts.reduce((sum, product) => {
    return sum + (product.price * (cartItems[product.id] || 0));
  }, 0);
  
  const shippingFee = totalAmount >= 100000 || totalAmount === 0 ? 0 : 3000;
  const finalAmount = totalAmount + shippingFee;

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.cartPage}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.icon}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={styles.title}>장바구니</h2>
      </header>

      <div className={styles.content}>
        {cartProducts.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>장바구니가 비어 있습니다.</p>
            <Link to="/" className={styles.goShopping}>쇼핑하러 가기</Link>
          </div>
        ) : (
          <>
            <ul className={styles.productList}>
              {cartProducts.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>{formatPrice(product.price)}원</p>
                    
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(product.id, -1)}>-</button>
                      <span>{cartItems[product.id]}</span>
                      <button onClick={() => updateQuantity(product.id, 1)}>+</button>
                    </div>
                  </div>
                  <button 
                    className={styles.removeButton} 
                    onClick={() => updateQuantity(product.id, -cartItems[product.id])}
                  >
                    삭제
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
                <span>{formatPrice(shippingFee)}원</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>총 결제금액</span>
                <span>{formatPrice(finalAmount)}원</span>
              </div>
              <button className={styles.checkoutButton} onClick={onCheckout}>
                결제하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
