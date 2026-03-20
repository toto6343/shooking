import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shooking_cart');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [notification, setNotification] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('shooking_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleCart = (productId, productName) => {
    setCartItems((prev) => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
        showNotification(`${productName} 상품이 삭제되었습니다.`);
      } else {
        next[productId] = 1;
        showNotification(`${productName} 상품이 추가되었습니다.`);
      }
      return next;
    });
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prev) => {
      const next = { ...prev };
      const currentQty = next[productId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        delete next[productId];
      } else {
        next[productId] = newQty;
      }
      return next;
    });
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('shooking_cart');
  };

  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      toggleCart, 
      updateQuantity, 
      clearCart, 
      cartCount,
      notification 
    }}>
      {children}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontSize: '0.9rem',
          fontWeight: '600',
          zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          {notification}
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </CartContext.Provider>
  );
};
