import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: '900', margin: 0, color: '#eee' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>페이지를 찾을 수 없습니다.</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        입력하신 주소가 잘못되었거나 삭제된 페이지입니다.
      </p>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: '30px',
          fontWeight: '700'
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
