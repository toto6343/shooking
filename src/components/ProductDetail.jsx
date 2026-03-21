import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { fetchProductById, fetchProducts } from '../api/productsApi';
import StyleSnap from './StyleSnap';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, toggleCart } = useCart();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [is360Mode, setIs360Mode] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const dragControls = useDragControls();


  const [showSizeGuide, setShowSizeGuide] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [localReviews, setLocalReviews] = React.useState([]);
  const [newReview, setNewReview] = React.useState({ rating: 5, content: '' });
  const { user } = useUser();
  
  // 단일 상품 조회
  const { data: product, isLoading: isProductLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id)
  });

  // 로컬 리뷰 로드 -> Supabase 리뷰 로드
  useEffect(() => {
    const fetchReviews = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', id)
          .order('created_at', { ascending: false });
        
        if (data) setLocalReviews(data);
      }
    };
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('로그인이 필요한 서비스입니다.', 'info');
      navigate('/login');
      return;
    }
    if (!newReview.content.trim()) return;

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id: parseInt(id),
        user_id: user.id,
        user_name: profile?.name || user.email.split('@')[0],
        rating: newReview.rating,
        content: newReview.content
      }])
      .select();

    if (error) {
      showToast('리뷰 등록 중 오류가 발생했습니다.', 'error');
    } else {
      setLocalReviews([data[0], ...localReviews]);
      setNewReview({ rating: 5, content: '' });
      showToast('리뷰가 등록되었습니다!');
    }
  };

  // 최근 본 상품 저장
  useEffect(() => {
    if (product) {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updated = [product.id, ...recentlyViewed.filter(itemId => itemId !== product.id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    }
  }, [product]);

  // 연관 상품 조회를 위해 전체 상품 목록 캐싱 활용
  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isError) {
    throw error; // Let ErrorBoundary catch it
  }

  if (isProductLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }
  
  if (!product) return <div style={{ padding: '4rem', textAlign: 'center' }}>상품을 찾을 수 없습니다.</div>;

  const itemKey = selectedSize ? `${product.id}-${selectedSize}` : null;
  const isInCart = itemKey ? !!cartItems[itemKey] : false;

  const relatedProducts = allProducts
    ? allProducts.filter((p) => p.brand === product.brand && p.id !== product.id).slice(0, 4)
    : [];

  const formatPrice = (price) => price.toLocaleString('ko-KR');

  const handleCartClick = () => {
    if (!selectedSize) {
      showToast('사이즈를 선택해주세요.', 'error');
      return;
    }
    toggleCart(product.id, product.name, selectedSize);
  };

  const handleRestockAlert = (size) => {
    if (!user) {
      showToast('로그인이 필요한 서비스입니다.', 'info');
      navigate('/login');
      return;
    }
    const alerts = JSON.parse(localStorage.getItem('restock_alerts') || '[]');
    const newAlert = { id: Date.now(), productId: product.id, productName: product.name, size };
    localStorage.setItem('restock_alerts', JSON.stringify([...alerts, newAlert]));
    showToast(`${product.name} (${size}mm) 재입고 알림이 신청되었습니다.`);
  };

  const mockReviews = [
    { id: 1, user: '신발매니아', rating: 5, date: '2024.03.15', content: '디자인이 너무 예뻐요! 배송도 빠르고 정사이즈입니다.' },
    { id: 2, user: '러너101', rating: 4, date: '2024.03.10', content: '쿠셔닝이 생각보다 더 좋네요. 오래 걸어도 발이 안 아파요.' },
    { id: 3, user: '스니커즈덕후', rating: 5, date: '2024.03.05', content: '색감이 사진보다 실물이 훨씬 예쁩니다. 만족해요!' },
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className={styles.detailPage}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "tween", ease: "anticipate", duration: 0.3 }}
    >
      <Helmet>
        <title>{product.name} | 슈킹 SHOOKING</title>
        <meta name="description" content={`${product.brand}의 ${product.name}. ${product.description}`} />
      </Helmet>

      <header className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <motion.div 
            className={`${styles.imageSection} ${is360Mode ? styles.mode360 : ''}`}
            layoutId={`product-image-${product.id}`}
            onClick={() => !is360Mode && setIsZoomed(true)}
            onPan={(e, info) => {
              if (is360Mode) {
                setRotation(prev => prev + info.delta.x * 0.5);
              }
            }}
          >
            <AnimatePresence mode="wait">
              {is360Mode ? (
                <motion.div 
                  key="360view"
                  className={styles.viewer360}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.img 
                    src={product.image} 
                    alt={product.name}
                    className={styles.productImage}
                    style={{ 
                      rotateY: rotation,
                      perspective: 1000
                    }}
                  />
                  <div className={styles.viewerInstruction}>드래그하여 돌려보세요</div>
                </motion.div>
              ) : (
                <motion.img 
                  key="normalview"
                  src={product.image} 
                  alt={`${product.brand} ${product.name}`} 
                  className={styles.productImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <button 
              className={`${styles.toggle360} ${is360Mode ? styles.active360 : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIs360Mode(!is360Mode);
                setRotation(0);
              }}
            >
              360°
            </button>
            {!is360Mode && <div className={styles.zoomHint}>클릭하여 확대</div>}
          </motion.div>

          <div className={styles.infoSection}>
            <div className={styles.badge}>{product.brand}</div>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.category}>{product.category}</p>
            <p className={styles.price}>{formatPrice(product.price)}원</p>
            
            <div className={styles.divider}></div>
            
            <div className={styles.sizeSection}>
              <div className={styles.sizeHeader}>
                <h3 className={styles.subTitle}>사이즈 선택</h3>
                <button 
                  className={styles.sizeGuideBtn}
                  onClick={() => setShowSizeGuide(true)}
                >
                  사이즈 가이드
                </button>
              </div>
              <div className={styles.sizeGrid}>
                {product.sizes.map(size => {
                  const isOutOfStock = product.outOfStockSizes.includes(size);
                  return (
                    <button
                      key={size}
                      className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''} ${isOutOfStock ? styles.outOfStock : ''}`}
                      onClick={() => isOutOfStock ? handleRestockAlert(size) : setSelectedSize(size)}
                    >
                      {size}
                      {isOutOfStock && <span className={styles.soldOutLabel}>알림신청</span>}
                    </button>
                  );
                })}

            </div>

            <div className={styles.divider}></div>
            
            <button 
              className={`${styles.cartButton} ${isInCart ? styles.active : ''}`}
              onClick={handleCartClick}
              aria-pressed={isInCart}
            >
              {isInCart ? '장바구니에서 제거' : '장바구니 담기'}
            </button>

            <div className={styles.shareSection}>
              <button 
                className={styles.shareBtn}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('URL이 복사되었습니다.');
                }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.shareIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                URL 복사
              </button>
              <button className={`${styles.shareBtn} ${styles.kakaoShare}`}>
                카카오 공유
              </button>
            </div>
            </div>
            </div>

        <div className={styles.lookbookSection}>
          <h2 className={styles.sectionTitle}>스타일 가이드</h2>
          <div className={styles.lookbookContent}>
            <div className={styles.styleTip}>
              <span className={styles.tipBadge}>TIP 1</span>
              <p>슬랙스나 데님 어디에나 매치하기 좋은 데일리 아이템입니다.</p>
            </div>
            <div className={styles.styleTip}>
              <span className={styles.tipBadge}>TIP 2</span>
              <p>와이드 팬츠와 함께 코디하면 더욱 트렌디한 룩을 완성할 수 있습니다.</p>
            </div>
          </div>
          </div>

          <StyleSnap productId={id} />

          {relatedProducts.length > 0 && (

          <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>함께 보면 좋은 상품</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <div 
                  key={p.id} 
                  className={styles.relatedCard}
                  onClick={() => navigate(`/product/${p.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name} 상세 보기`}
                >
                  <div className={styles.relatedImageWrapper}>
                    <img src={p.image} alt={p.name} className={styles.relatedImage} loading="lazy" />
                  </div>
                  <p className={styles.relatedName}>{p.name}</p>
                  <p className={styles.relatedPrice}>{formatPrice(p.price)}원</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.reviewSection}>
          <h2 className={styles.sectionTitle}>구매 후기 ({mockReviews.length + localReviews.length})</h2>
          
          <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
            <div className={styles.reviewFormHeader}>
              <span className={styles.formLabel}>평점 선택</span>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num} 
                    type="button"
                    className={newReview.rating >= num ? styles.starActive : styles.starNormal}
                    onClick={() => setNewReview({ ...newReview, rating: num })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea 
              className={styles.reviewTextarea}
              placeholder="착용감, 사이즈 등 상세한 후기를 남겨주세요."
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              required
            />
            <button type="submit" className={styles.reviewSubmitBtn}>리뷰 등록하기</button>
          </form>

          <div className={styles.reviewList}>
            {[...localReviews, ...mockReviews].map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewUser}>{review.user}</span>
                  <span className={styles.reviewDate}>{review.date}</span>
                </div>
                <StarRating rating={review.rating} />
                <p className={styles.reviewContent}>{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSizeGuide && (
        <div className={styles.modalOverlay} onClick={() => setShowSizeGuide(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>사이즈 가이드</h3>
              <button className={styles.closeBtn} onClick={() => setShowSizeGuide(false)}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th>KR (mm)</th>
                    <th>US (Men)</th>
                    <th>US (Women)</th>
                    <th>EU</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>230</td><td>5</td><td>6.5</td><td>37</td></tr>
                  <tr><td>240</td><td>6</td><td>7.5</td><td>38.5</td></tr>
                  <tr><td>250</td><td>7</td><td>8.5</td><td>40</td></tr>
                  <tr><td>260</td><td>8</td><td>9.5</td><td>41</td></tr>
                  <tr><td>270</td><td>9</td><td>10.5</td><td>42.5</td></tr>
                  <tr><td>280</td><td>10</td><td>11.5</td><td>44</td></tr>
                  <tr><td>290</td><td>11</td><td>12.5</td><td>45</td></tr>
                </tbody>
              </table>
              <p className={styles.guideNote}>* 브랜드 및 모델에 따라 차이가 있을 수 있습니다.</p>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            className={styles.zoomOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.img 
              src={product.image} 
              alt={product.name}
              className={styles.zoomedImage}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
            <button className={styles.zoomClose}>&times;</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetail;
