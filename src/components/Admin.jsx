import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import styles from './Admin.module.css';

import { supabase } from '../api/supabase';

const Admin = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    popularProduct: '에어 맥스 270'
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setOrders(data);
        const sales = data.reduce((sum, order) => sum + order.total_amount, 0);
        setStats(prev => ({
          ...prev,
          totalSales: sales,
          orderCount: data.length
        }));
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>관리자 대시보드 | 슈킹 SHOOKING</title>
      </Helmet>

      <h1 className={styles.title}>관리자 대시보드</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>총 매출액</p>
          <h3 className={styles.statValue}>{stats.totalSales.toLocaleString()}원</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>총 주문 건수</p>
          <h3 className={styles.statValue}>{stats.orderCount}건</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>인기 상품</p>
          <h3 className={styles.statValue}>{stats.popularProduct}</h3>
        </div>
      </div>

      <div className={styles.analyticsRow}>
        <div className={styles.predictionCard}>
          <h3>재고 예측 대시보드 (AI)</h3>
          <ul className={styles.predictionList}>
            <li><strong>에어 맥스 270</strong>: 3일 내 품절 예상 (신규 주문 급증)</li>
            <li><strong>조던 1 레트로</strong>: 재고 여유 (안정적 판매)</li>
            <li><strong>울트라부스트</strong>: 1주일 내 재입고 권장</li>
          </ul>
        </div>
        <div className={styles.abTestCard}>
          <h3>메인 배너 A/B 테스트</h3>
          <div className={styles.abChart}>
            <div className={styles.chartBar}>
              <span>A안 (기본)</span>
              <div className={styles.barWrapper}><div className={styles.bar} style={{ width: '45%' }}>45%</div></div>
            </div>
            <div className={styles.chartBar}>
              <span>B안 (강조)</span>
              <div className={styles.barWrapper}><div className={styles.bar} style={{ width: '68%', backgroundColor: '#ff3b30' }}>68%</div></div>
            </div>
          </div>
          <p className={styles.abNote}>* B안의 구매 전환율이 23% 더 높습니다.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3>최근 주문 현황</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>주문일자</th>
                <th>주문자</th>
                <th>결제금액</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.shipping_info.receiver || order.shipping_info.recipientName}</td>
                  <td>{order.total_amount.toLocaleString()}원</td>
                  <td><span className={styles.statusBadge}>결제완료</span></td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.empty}>주문 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
