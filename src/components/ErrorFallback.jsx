import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-color)'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>앗! 문제가 발생했습니다.</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        서버와의 통신 중 오류가 발생했거나, 예상치 못한 문제가 생겼습니다. 다시 시도해 주세요.
      </p>
      <pre style={{ 
        backgroundColor: 'var(--gray-100)', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#ff3b30',
        marginBottom: '2rem',
        maxWidth: '100%',
        overflowX: 'auto'
      }}>
        {error.message}
      </pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        다시 시도하기
      </button>
    </div>
  );
};

export default ErrorFallback;
