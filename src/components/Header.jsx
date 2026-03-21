import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { fetchProducts } from '../api/productsApi';
import styles from './Header.module.css';

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout, profile } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  // Sync searchTerm state with URL param (e.g., if navigating back)
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    if (searchTerm.trim() && products) {
      const filtered = products
        .filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleSuggestionClick = (p) => {
    setSearchTerm(p.name);
    setShowSuggestions(false);
    navigate(`/product/${p.id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          SHOOKING
        </Link>

        <Link to="/community" className={styles.communityLink}>
          커뮤니티
        </Link>
        
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="검색어를 입력하세요..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button type="submit" className={styles.searchButton} aria-label="검색">
              <svg 
                className={styles.searchIcon} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map(p => (
                  <div 
                    key={p.id} 
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(p)}
                  >
                    <img src={p.image} alt="" className={styles.suggestionImg} />
                    <div className={styles.suggestionInfo}>
                      <p className={styles.suggestionName}>{p.name}</p>
                      <p className={styles.suggestionBrand}>{p.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className={styles.navIcons}>
          <Link to="/wishlist" className={styles.navLink} aria-label="위시리스트">
            <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          <Link to="/cart" className={styles.navLink} aria-label="장바구니">
            <svg 
              className={styles.navIcon} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartCount}>{cartCount}</span>
            )}
          </Link>

          <button onClick={toggleTheme} className={styles.themeBtn} aria-label="테마 변경">
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          {user ? (
            <div className={styles.userSection}>
              <Link to="/orders" className={styles.userName}>{profile?.name || user.email.split('@')[0]}님</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>로그아웃</button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
