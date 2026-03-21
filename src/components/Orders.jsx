import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productsApi';
import styles from './Orders.module.css';

import { supabase } from '../api/supabase';
import { useUser } from '../context/UserContext';

const DeliveryTracker = ({ status }) => {
  const steps = ['결제완료', '상품준비중', '배송중', '배송완료'];
  const currentStep = status === '배송준비중' ? 1 : 0; 

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.trackerLine}>
        <motion.div 
          className={styles.trackerProgress}
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className={styles.trackerSteps}>
        {steps.map((step, index) => (
          <div key={step} className={`${styles.step} ${index <= currentStep ? styles.activeStep : ''}`}>
            <div className={styles.stepDot}>
              {index < currentStep ? '✓' : index === currentStep ? '●' : ''}
            </div>
            <span className={styles.stepLabel}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user, loading: userLoading } = useUser();
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setOrders(data);
      }
    };
    if (!userLoading) fetchOrders();
  }, [user, userLoading]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const getProductInfo = (id) => {
    return products?.find(p => p.id === Number(id));
  };

  if (userLoading) return null;
  if (!user) return <div className={styles.empty}><p>로그인이 필요한 페이지입니다.</p></div>;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>주문 내역 | 슈킹 SHOOKING</title>
      </Helmet>

      <h1 className={styles.title}>주문 내역</h1>

      {orders.length > 0 ? (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <motion.div 
              key={order.id} 
              className={styles.orderCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                  <span className={styles.orderId}>주문번호 {order.id}</span>
                </div>
                <div className={styles.orderStatus}>
                  {order.shipping_info.isGift ? '🎁 선물 완료' : '배송 준비중'}
                </div>
              </div>

              <DeliveryTracker status="배송준비중" />

              <div className={styles.itemList}>
                {Object.entries(order.items).map(([itemKey, quantity]) => {
                  const [productId, size] = itemKey.split('-');
                  const product = getProductInfo(productId);
                  if (!product) return null;
                  return (
                    <div key={itemKey} className={styles.item}>
                      <img src={product.image} alt={product.name} className={styles.itemImage} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemBrand}>{product.brand}</p>
                        <p className={styles.itemName}>{product.name}</p>
                        <p className={styles.itemPrice}>
                          {product.price.toLocaleString()}원 · {size}mm · {quantity}개
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.totalInfo}>
                  총 결제 금액 <strong>{order.total_amount.toLocaleString()}원</strong>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>주문 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
