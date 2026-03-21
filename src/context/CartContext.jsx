import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  // Initialize from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shooking_cart');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('shooking_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleCart = (productId, productName, size) => {
    if (!size) {
      setCartItems((prev) => {
        const next = { ...prev };
        let removed = false;
        Object.keys(next).forEach(key => {
          if (key.startsWith(`${productId}-`)) {
            delete next[key];
            removed = true;
          }
        });
        if (removed) {
          showToast(`${productName} 상품이 장바구니에서 삭제되었습니다.`, 'info');
        }
        return next;
      });
      return;
    }

    const itemKey = `${productId}-${size}`;
    setCartItems((prev) => {
      const next = { ...prev };
      if (next[itemKey]) {
        delete next[itemKey];
        showToast(`${productName} (${size}) 상품이 삭제되었습니다.`, 'info');
      } else {
        next[itemKey] = 1;
        showToast(`${productName} (${size}) 상품이 추가되었습니다.`);
      }
      return next;
    });
  };

  const updateQuantity = (itemKey, delta) => {
    setCartItems((prev) => {
      const next = { ...prev };
      const currentQty = next[itemKey] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        delete next[itemKey];
      } else {
        next[itemKey] = newQty;
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
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
