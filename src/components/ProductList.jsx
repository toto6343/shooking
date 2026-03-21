import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import RecentlyViewed from './RecentlyViewed';
import MainBanner from './MainBanner';
import HotDeal from './HotDeal';
import { fetchProducts } from '../api/productsApi';
import styles from './ProductList.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(8);
  
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isError) {
    throw error; // Let the ErrorBoundary catch it
  }

  const categories = useMemo(() => 
    products ? ['전체', ...new Set(products.map(p => p.category))] : ['전체'], 
    [products]
  );

  const brands = useMemo(() => 
    products ? [...new Set(products.map(p => p.brand))] : [], 
    [products]
  );

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Simulate more products for infinite scroll demo (duplicate items)
    if (!searchQuery && selectedCategory === '전체' && selectedBrands.length === 0) {
      result = [...result, ...result.map(p => ({ ...p, id: p.id + 100 })), ...result.map(p => ({ ...p, id: p.id + 200 }))];
    }

    // 1. Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // 2. Category filter
    if (selectedCategory !== '전체') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Multi-Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 4. Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // 5. Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrands, priceRange, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const personalRecommendations = useMemo(() => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (recentlyViewed.length === 0 || !products) return [];
    
    // Get brands from recently viewed
    const viewedBrands = recentlyViewed
      .map(id => products.find(p => p.id === Number(id))?.brand)
      .filter(Boolean);
    
    const favoriteBrand = viewedBrands.length > 0 ? viewedBrands[0] : null;
    
    if (!favoriteBrand) return [];

    return products
      .filter(p => p.brand === favoriteBrand && !recentlyViewed.includes(p.id))
      .slice(0, 4);
  }, [products]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Helmet>
        <title>슈킹 - 최신 트렌드 스니커즈</title>
        <meta name="description" content="나이키, 아디다스, 뉴발란스 등 가장 핫한 신발들을 슈킹에서 만나보세요." />
      </Helmet>

      {!searchQuery && <MainBanner />}
      {!searchQuery && <RecentlyViewed />}
      {!searchQuery && products && <HotDeal product={products.find(p => p.id === 2)} />}

      {!searchQuery && personalRecommendations.length > 0 && (
        <div className={styles.curationSection}>
          <h2 className={styles.curationTitle}>
            {user ? `${user.name}님` : '당신'}을 위한 맞춤 추천
          </h2>
          <div className={styles.curationGrid}>
            {personalRecommendations.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className={styles.controlsSection}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>카테고리</label>
          <div className={styles.filterSection}>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>브랜드 (중복 선택 가능)</label>
          <div className={styles.filterSection}>
            {brands.map(brand => (
              <button
                key={brand}
                className={`${styles.filterButton} ${selectedBrands.includes(brand) ? styles.active : ''}`}
                onClick={() => toggleBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>가격 범위 (~{priceRange[1].toLocaleString()}원)</label>
          <div className={styles.priceSection}>
            <input 
              type="range" 
              min="0" 
              max="300000" 
              step="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className={styles.priceSlider}
            />
          </div>
        </div>

        <div className={styles.sortSection}>
          <select 
            className={styles.sortSelect} 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">최신순</option>
            <option value="price-asc">가격 낮은순</option>
            <option value="price-desc">가격 높은순</option>
            <option value="name-asc">이름순</option>
          </select>
        </div>
      </div>
      
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          {searchQuery ? `'${searchQuery}' 검색 결과` : `${selectedCategory} 상품`}
          <span className={styles.count}>{filteredProducts.length}개</span>
        </h2>
      </div>
      
      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <motion.div key={`skeleton-${idx}`} variants={itemVariants}>
                <SkeletonCard />
              </motion.div>
            ))
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className={styles.noResults}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              검색 결과가 없습니다.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <div className={styles.loadMoreSection}>
          <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
            더 보기
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;
