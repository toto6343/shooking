import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import ProductDetail from './components/ProductDetail';
import { products } from './data/products';
import { CartProvider, useCart } from './context/CartContext';
import './App.css';

const AppContent = () => {
  const { cartItems, clearCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const calculateTotal = () => {
    const total = Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const product = products.find((p) => p.id === parseInt(id));
      return sum + (product ? product.price * qty : 0);
    }, 0);
    const shipping = total >= 100000 || total === 0 ? 0 : 3000;
    return total + shipping;
  };

  const handlePaymentSuccess = () => {
    clearCart();
    window.location.href = '/';
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<ProductList products={products} />} />
        <Route 
          path="/cart" 
          element={
            <Cart 
              products={products} 
              onCheckout={() => setIsPaymentModalOpen(true)} 
            />
          } 
        />
        <Route 
          path="/product/:id" 
          element={<ProductDetail products={products} />} 
        />
      </Routes>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={calculateTotal()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
