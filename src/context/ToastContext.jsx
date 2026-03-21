import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Toast.module.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Activity Ticker
  useEffect(() => {
    const activities = [
      '방금 전 서울시 강남구에서 에어 맥스 270 상품이 구매되었습니다.',
      '조던 1 레트로 하이 블랙 컬러가 전 사이즈 재입고되었습니다!',
      '방금 전 부산시 해운대구에서 척 테일러 올스타 상품이 구매되었습니다.',
      '현재 57명이 이 상품을 함께 보고 있습니다.',
      '슈킹 신규 회원 가입 시 웰컴 쿠폰이 즉시 발급됩니다.'
    ];

    const timer = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      showToast(randomActivity, 'info');
    }, 25000); // Every 25 seconds

    return () => clearInterval(timer);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`${styles.toast} ${styles[toast.type]}`}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <span className={styles.icon}>
                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'ℹ'}
              </span>
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
