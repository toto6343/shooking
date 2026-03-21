import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      alert(error.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.logo}>SHOOKING</h1>
        <p className={styles.subtitle}>프리미엄 스니커즈 쇼핑몰</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>이메일</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@shooking.com"
              required 
            />
          </div>
          <div className={styles.field}>
            <label>비밀번호</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required 
            />
          </div>
          <button type="submit" className={styles.submitBtn}>로그인</button>
        </form>
        
        <div className={styles.links}>
          <span>계정이 없으신가요?</span>
          <button className={styles.signupLink}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
