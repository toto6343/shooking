import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './PaymentModal.module.css';
import { usePayment } from '../context/PaymentContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { fetchProducts } from '../api/productsApi';
import { calculateCartTotal } from '../utils/cartUtils';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { cards, addCard, removeCard, savedAddress, saveAddress } = usePayment();
  const { cartItems } = useCart();
  const { user, tier, addPoints } = useUser();
  const { showToast } = useToast();
  const [step, setStep] = useState('address'); // address, selectCard, addCard, confirming, processing, success
  const [selectedCard, setSelectedCard] = useState(null);
  const [isGift, setIsGift] = useState(false);
  const [giftInfo, setGiftInfo] = useState({
    recipientName: '',
    recipientPhone: '',
    message: ''
  });
  
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    enabled: isOpen,
  });

  const { finalAmount: baseTotalAmount } = calculateCartTotal(cartItems, products || []);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Tier Discount
  const tierDiscount = Math.floor(baseTotalAmount * (tier?.discount || 0));
  const totalAmount = baseTotalAmount - discount - tierDiscount;

  const handleApplyCoupon = () => {
    if (couponCode === 'WELCOME30') {
      const discountAmount = Math.floor(baseTotalAmount * 0.3);
      setDiscount(discountAmount);
      setCouponError('');
      showToast('30% 할인이 적용되었습니다!');
    } else {
      setCouponError('유효하지 않은 쿠폰 코드입니다.');
      setDiscount(0);
    }
  };

  const [shippingInfo, setShippingInfo] = useState({
    receiver: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: ''
  });

  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    password: ''
  });

  useEffect(() => {
    if (savedAddress && isOpen) {
      setShippingInfo(savedAddress);
    }
  }, [savedAddress, isOpen]);

  if (!isOpen) return null;

  // 다음 우편번호 검색 API 호출 함수
  const handleZipcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 검색 결과에서 주소 정보를 가져와 상태 업데이트
        setShippingInfo(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.address
        }));
        // 상세 주소 입력칸으로 포커스 이동 (선택 사항)
        document.getElementsByName('detailAddress')[0]?.focus();
      }
    }).open();
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    saveAddress(shippingInfo);
    setStep('selectCard');
  };

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

    setNewCard(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    const card = addCard(newCard);
    setSelectedCard(card);
    setStep('selectCard');
    setNewCard({ number: '', expiry: '', cvc: '', password: '' });
  };

  const handlePaymentStart = (card) => {
    setSelectedCard(card);
    setStep('confirming');
  };

  const handleConfirm = async () => {
    setStep('processing');
    
    try {
      const orderData = {
        id: `ORD-${Date.now()}`,
        user_id: user?.id || null,
        items: cartItems,
        total_amount: totalAmount,
        shipping_info: isGift ? { ...giftInfo, isGift: true } : shippingInfo,
        card_info: selectedCard?.displayNumber || '간편결제',
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // Add points (1% of purchase)
      if (user) {
        await addPoints(Math.floor(totalAmount * 0.01));
      }

      setStep('success');
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setStep('address');
        setSelectedCard(null);
        setIsGift(false);
      }, 2000);
    } catch (error) {
      console.error('Order error:', error);
      showToast('주문 처리 중 오류가 발생했습니다.', 'error');
      setStep('selectCard');
    }
  };

  const formatPrice = (price) => price.toLocaleString('ko-KR');

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="닫기">&times;</button>
        
        {step === 'address' && (
          <div className={styles.viewContainer}>
            <h2 className={styles.title}>배송지 정보 입력</h2>
            <div className={styles.amountInfo}>
              결제 금액: <strong>{formatPrice(totalAmount)}원</strong>
            </div>

            <div className={styles.giftToggle}>
              <button 
                type="button" 
                className={`${styles.toggleBtn} ${isGift ? styles.active : ''}`}
                onClick={() => setIsGift(!isGift)}
              >
                {isGift ? '🎁 선물하기 모드 ON' : '🎁 친구에게 선물하시겠나요?'}
              </button>
            </div>
            
            <form className={styles.form} onSubmit={handleAddressSubmit}>
              {isGift ? (
                <>
                  <div className={styles.field}>
                    <label>받는 사람</label>
                    <input 
                      type="text" 
                      placeholder="친구의 이름을 입력하세요"
                      value={giftInfo.recipientName}
                      onChange={(e) => setGiftInfo({...giftInfo, recipientName: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label>친구 연락처</label>
                    <input 
                      type="tel" 
                      placeholder="010-0000-0000"
                      value={giftInfo.recipientPhone}
                      onChange={(e) => setGiftInfo({...giftInfo, recipientPhone: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label>선물 메시지</label>
                    <textarea 
                      placeholder="축하의 메시지를 남겨보세요!"
                      value={giftInfo.message}
                      onChange={(e) => setGiftInfo({...giftInfo, message: e.target.value})}
                      className={styles.giftTextarea}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.field}>
                    <label>수령인</label>
                    <input 
                      type="text" 
                      name="receiver"
                      placeholder="이름을 입력하세요"
                      value={shippingInfo.receiver}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label>연락처</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="010-0000-0000"
                      value={shippingInfo.phone}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  
                  {/* Zipcode Field with Search Button */}
                  <div className={styles.field}>
                    <label>우편번호</label>
                    <div className={styles.zipcodeRow}>
                      <input 
                        type="text" 
                        name="zipcode"
                        placeholder="우편번호"
                        value={shippingInfo.zipcode}
                        readOnly
                        required
                      />
                      <button 
                        type="button" 
                        className={styles.searchBtn}
                        onClick={handleZipcodeSearch}
                      >
                        주소 검색
                      </button>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>주소</label>
                    <input 
                      type="text" 
                      name="address"
                      placeholder="기본 주소"
                      value={shippingInfo.address}
                      readOnly
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label>상세 주소</label>
                    <input 
                      type="text" 
                      name="detailAddress"
                      placeholder="상세 주소를 입력하세요"
                      value={shippingInfo.detailAddress}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className={styles.divider}></div>

              <div className={styles.field}>
                <label>할인 쿠폰</label>
                <div className={styles.couponRow}>
                  <input 
                    type="text" 
                    placeholder="쿠폰 코드를 입력하세요"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="button" className={styles.couponBtn} onClick={handleApplyCoupon}>적용</button>
                </div>
                {couponError && <p className={styles.errorText}>{couponError}</p>}
                {discount > 0 && <p className={styles.successText}>30% 할인이 적용되었습니다 (-{formatPrice(discount)}원)</p>}
              </div>

              <button type="submit" className={styles.submitButton}>다음으로</button>
            </form>
          </div>
        )}

        {step === 'selectCard' && (
          <div className={styles.viewContainer}>
            <div className={styles.headerWithBack}>
              <button className={styles.backBtn} onClick={() => setStep('address')}>←</button>
              <h2 className={styles.title}>결제 카드 선택</h2>
            </div>
            <div className={styles.amountInfo}>
              결제 금액: <strong>{formatPrice(totalAmount)}원</strong>
            </div>
            <div className={styles.simplePaymentGroup}>
              <button type="button" className={`${styles.simpleBtn} ${styles.kakao}`} onClick={() => handleConfirm()}>
                <span className={styles.payIcon}>K</span> 카카오페이
              </button>
              <button type="button" className={`${styles.simpleBtn} ${styles.naver}`} onClick={() => handleConfirm()}>
                <span className={styles.payIcon}>N</span> 네이버페이
              </button>
              <button type="button" className={`${styles.simpleBtn} ${styles.toss}`} onClick={() => handleConfirm()}>
                <span className={styles.payIcon}>T</span> 토스페이
              </button>
            </div>

            <div className={styles.orDivider}>
              <span>또는 카드 결제</span>
            </div>

            <div className={styles.cardList}>
              {cards.map((card) => (
                <div key={card.id} className={styles.cardItemWrapper}>
                  <button className={styles.cardItem} onClick={() => handlePaymentStart(card)}>
                    <div className={styles.cardItemInfo}>
                      <span className={styles.cardItemNumber}>{card.displayNumber}</span>
                      <span className={styles.cardItemExpiry}>{card.expiry}</span>
                    </div>
                  </button>
                  <button className={styles.deleteCardBtn} onClick={() => removeCard(card.id)} title="삭제">&times;</button>
                </div>
              ))}
              <button className={styles.addCardPrompt} onClick={() => setStep('addCard')}>
                <span className={styles.plusIcon}>+</span>
                <span>새 카드 추가</span>
              </button>
            </div>
          </div>
        )}

        {step === 'addCard' && (
          <div className={styles.formContainer}>
            <div className={styles.headerWithBack}>
              <button className={styles.backBtn} onClick={() => setStep('selectCard')}>←</button>
              <h2 className={styles.title}>새 카드 등록</h2>
            </div>
            <div className={styles.cardPreview}>
              <div className={styles.cardChip}></div>
              <div className={styles.cardNumberPreview}>{newCard.number || '0000 0000 0000 0000'}</div>
              <div className={styles.cardBottomRow}>
                <div className={styles.cardLabelGroup}><span className={styles.cardLabel}>VALID THRU</span><span className={styles.cardValue}>{newCard.expiry || 'MM / YY'}</span></div>
                <div className={styles.cardLabelGroup}><span className={styles.cardLabel}>CVC</span><span className={styles.cardValue}>{newCard.cvc ? '***' : '000'}</span></div>
              </div>
            </div>
            <form className={styles.form} onSubmit={handleAddCardSubmit}>
              <div className={styles.field}><label>카드 번호</label><input type="text" name="number" placeholder="0000 0000 0000 0000" value={newCard.number} onChange={handleInputChange} required /></div>
              <div className={styles.row}>
                <div className={styles.field}><label>유효기간</label><input type="text" name="expiry" placeholder="MM / YY" value={newCard.expiry} onChange={handleInputChange} required /></div>
                <div className={styles.field}><label>CVC</label><input type="password" name="cvc" placeholder="3자리" value={newCard.cvc} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.field}><label>비밀번호 앞 2자리</label><input type="password" name="password" placeholder="**" value={newCard.password} onChange={handleInputChange} required /></div>
              <button type="submit" className={styles.submitButton} disabled={newCard.number.replace(/\s/g, '').length < 16} style={{ opacity: newCard.number.replace(/\s/g, '').length < 16 ? 0.5 : 1 }}>등록하기</button>
            </form>
          </div>
        )}

        {step === 'confirming' && (
          <div className={styles.confirmView}>
            <h2 className={styles.title}>주문 최종 확인</h2>
            <p className={styles.description}>아래 정보로 주문을 완료하시겠습니까?</p>
            <div className={styles.summaryBox}>
              <div className={styles.confirmSection}>
                <h4>📦 배송지 정보</h4>
                <p>{shippingInfo.receiver} ({shippingInfo.phone})</p>
                <p>[{shippingInfo.zipcode}] {shippingInfo.address}</p>
                <p>{shippingInfo.detailAddress}</p>
              </div>
              <div className={styles.confirmSection} style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <h4>💳 결제 정보</h4>
                <p>카드: {selectedCard?.displayNumber}</p>
                <p>총 결제 금액: <strong>{formatPrice(totalAmount)}원</strong></p>
              </div>
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.cancelButton} onClick={() => setStep('selectCard')}>취소</button>
              <button className={styles.confirmButton} onClick={handleConfirm}>결제 확정</button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className={styles.processingView}>
            <div className={styles.spinner}></div>
            <p>주문을 처리 중입니다...</p>
          </div>
        )}

        {step === 'success' && (
          <div className={styles.successView}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.title}>주문 완료</h2>
            <p>감사합니다! 주문이 성공적으로 완료되었습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
