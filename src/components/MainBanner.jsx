import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MainBanner.module.css';

const banners = [
  {
    id: 1,
    title: 'SPRING NEW ARRIVALS',
    subtitle: '봄을 알리는 새로운 스니커즈 컬렉션',
    color: '#f0f0f0',
    image: '/images/shoes/airmax270.jpg',
    textColor: '#000'
  },
  {
    id: 2,
    title: 'RUNNING REVOLUTION',
    subtitle: '최상의 퍼포먼스를 위한 기능성 러닝화',
    color: '#1a1a1a',
    image: '/images/shoes/ultraboost22.jpg',
    textColor: '#fff'
  },
  {
    id: 3,
    title: 'CLASSIC IS BEST',
    subtitle: '변치 않는 스타일, 아이코닉 클래식',
    color: '#e8e8e8',
    image: '/images/shoes/stansmith.jpg',
    textColor: '#000'
  }
];

const MainBanner = () => {
  const [current, setCurrent] = useState(0);
  const [abVersion, setAbVersion] = useState('A');

  useEffect(() => {
    // Randomly assign A or B version for the session
    setAbVersion(Math.random() > 0.5 ? 'B' : 'A');
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.bannerContainer}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          className={styles.banner}
          style={{ backgroundColor: banners[current].color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.content} style={{ color: banners[current].textColor }}>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.title}
            >
              {banners[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={styles.subtitle}
            >
              {banners[current].subtitle}
            </motion.p>
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={`${styles.cta} ${abVersion === 'B' ? styles.ctaHighlight : ''}`}
              style={{ 
                borderColor: banners[current].textColor,
                color: abVersion === 'B' ? (banners[current].textColor === '#fff' ? '#000' : '#fff') : banners[current].textColor,
                backgroundColor: abVersion === 'B' ? banners[current].textColor : 'transparent'
              }}
            >
              자세히 보기
            </motion.button>
          </div>
          <div className={styles.imageWrapper}>
            <motion.img 
              src={banners[current].image} 
              alt={banners[current].title}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={styles.image}
            />
          </div>
        </motion.div>
      </AnimatePresence>
      <div className={styles.indicators}>
        {banners.map((_, index) => (
          <div 
            key={index}
            className={`${styles.dot} ${current === index ? styles.active : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainBanner;
