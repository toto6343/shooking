import React, { useState } from 'react';
import styles from './PaymentModal.module.css';

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
  const [step, setStep] = useState('input'); // input, confirming, processing, success
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').substring(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + ' / ' + formattedValue.substring(2);
      }
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    } else if (name === 'password') {
      formattedValue = value.replace(/\D/g, '').substring(0, 2);
    }

    setCardInfo(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('confirming');
  };

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setStep('input');
        setCardInfo({ number: '', expiry: '', cvc: '', password: '' });
      }, 2000);
    }, 1500);
  };

  const formatPrice = (price) => price.toLocaleString('ko-KR');

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        {step === 'input' && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>카드 등록 및 결제</h2>
            <div className={styles.amountInfo}>
              결제 금액: <strong>{formatPrice(totalAmount)}원</strong>
            </div>

            <div className={styles.field}>
              <label>카드 번호</label>
              <input 
                type="text" 
                name="number"
                placeholder="0000 0000 0000 0000"
                value={cardInfo.number}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>유효기간</label>
                <input 
                  type="text" 
                  name="expiry"
                  placeholder="MM / YY"
                  value={cardInfo.expiry}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>CVC</label>
                <input 
                  type="password" 
                  name="cvc"
                  placeholder="3자리"
                  value={cardInfo.cvc}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>비밀번호 앞 2자리</label>
              <input 
                type="password" 
                name="password"
                placeholder="**"
                value={cardInfo.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>결제하기</button>
          </form>
        )}

        {step === 'confirming' && (
          <div className={styles.confirmView}>
            <h2 className={styles.title}>결제 확인</h2>
            <p className={styles.description}>아래 정보로 결제를 진행하시겠습니까?</p>
            <div className={styles.summaryBox}>
              <p>결제 금액: <strong>{formatPrice(totalAmount)}원</strong></p>
              <p>카드 번호: {cardInfo.number.substring(0, 7)} **** **** {cardInfo.number.substring(15)}</p>
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.cancelButton} onClick={() => setStep('input')}>취소</button>
              <button className={styles.confirmButton} onClick={handleConfirm}>확인</button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className={styles.processingView}>
            <div className={styles.spinner}></div>
            <p>결제가 진행 중입니다...</p>
          </div>
        )}

        {step === 'success' && (
          <div className={styles.successView}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.title}>결제 완료</h2>
            <p>주문이 성공적으로 완료되었습니다!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
