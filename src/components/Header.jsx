import React from 'react';
import styles from './Header.module.css';

const Header = ({ cartCount }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>SHOOKING</h1>
        <div className={styles.cart}>
          <svg 
            className={styles.cartIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
          </svg>
          {cartCount > 0 && (
            <span className={styles.cartCount}>{cartCount}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
