import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import ProductDetail from './components/ProductDetail';
import { products } from './data/products';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState({}); // { productId: quantity }
  const [view, setView] = useState('list'); // 'list', 'cart', 'detail'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleToggleCart = (productId) => {
    setCartItems((prev) => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
      } else {
        next[productId] = 1;
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

  const calculateTotal = () => {
    const total = Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const product = products.find((p) => p.id === parseInt(id));
      return sum + (product ? product.price * qty : 0);
    }, 0);
    const shipping = total >= 100000 || total === 0 ? 0 : 3000;
    return total + shipping;
  };

  const handlePaymentSuccess = () => {
    setCartItems({});
    setView('list');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('detail');
  };

  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const renderView = () => {
    switch (view) {
      case 'cart':
        return (
          <Cart 
            cartItems={cartItems} 
            products={products} 
            onUpdateQuantity={updateQuantity}
            onRemove={(id) => updateQuantity(id, -(cartItems[id] || 0))}
            onBack={() => setView('list')}
            onCheckout={() => setIsPaymentModalOpen(true)}
          />
        );
      case 'detail':
        return (
          <ProductDetail 
            product={selectedProduct}
            allProducts={products}
            isInCart={!!cartItems[selectedProduct.id]}
            onToggleCart={handleToggleCart}
            onBack={() => setView('list')}
          />
        );
      case 'list':
      default:
        return (
          <>
            <Header 
              cartCount={cartCount} 
              onCartClick={() => setView('cart')} 
            />
            <ProductList
              products={products}
              cartItems={Object.keys(cartItems).map(Number)}
              onToggleCart={handleToggleCart}
              onProductClick={handleProductClick}
            />
          </>
        );
    }
  };

  return (
    <div className="App">
      {renderView()}

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={calculateTotal()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default App;
