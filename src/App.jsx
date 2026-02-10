import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import { products } from './data/products';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleToggleCart = (productId) => {
    setCartItems((prevItems) => {
      if (prevItems.includes(productId)) {
        // 이미 장바구니에 있으면 제거
        return prevItems.filter((id) => id !== productId);
      } else {
        // 장바구니에 추가
        return [...prevItems, productId];
      }
    });
  };

  return (
    <div className="App">
      <Header cartCount={cartItems.length} />
      <ProductList
        products={products}
        cartItems={cartItems}
        onToggleCart={handleToggleCart}
      />
    </div>
  );
}

export default App;
