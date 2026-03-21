import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ErrorFallback from './components/ErrorFallback';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound';
import SupportBot from './components/SupportBot';
import { CartProvider, useCart } from './context/CartContext';
import { PaymentProvider } from './context/PaymentContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';

// Lazy loading components
const ProductList = lazy(() => import('./components/ProductList'));
const Cart = lazy(() => import('./components/Cart'));
const PaymentModal = lazy(() => import('./components/PaymentModal'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const OrderSuccess = lazy(() => import('./components/OrderSuccess'));
const Login = lazy(() => import('./components/Login'));
const Orders = lazy(() => import('./components/Orders'));
const Admin = lazy(() => import('./components/Admin'));
const Community = lazy(() => import('./components/Community'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback UI
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const AnimatedRoutes = ({ setIsPaymentModalOpen }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProductList />} />
        <Route 
          path="/cart" 
          element={<Cart onCheckout={() => setIsPaymentModalOpen(true)} />} 
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/community" element={<Community />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { cartItems, clearCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="App">
      <Helmet>
        <title>SHOOKING - 프리미엄 신발 쇼핑몰</title>
        <meta name="description" content="2030을 위한 프리미엄 스니커즈 쇼핑몰 슈킹입니다." />
      </Helmet>
      
      <ScrollToTop />
      <Header />
      
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => navigate('/')}>
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes setIsPaymentModalOpen={setIsPaymentModalOpen} />
          <PaymentModal 
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={() => {
              clearCart();
              setIsPaymentModalOpen(false);
              navigate('/order-success');
            }}
          />
        </Suspense>
      </ErrorBoundary>
      <SupportBot />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <UserProvider>
              <CartProvider>
                <PaymentProvider>
                  <Router>
                    <AppContent />
                  </Router>
                </PaymentProvider>
              </CartProvider>
            </UserProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
