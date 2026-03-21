import React, { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  // 카드 정보
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('shooking_cards');
    return saved ? JSON.parse(saved) : [];
  });

  // 배송지 정보 (가장 최근에 사용한 주소 저장)
  const [savedAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem('shooking_address');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('shooking_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    if (savedAddress) {
      localStorage.setItem('shooking_address', JSON.stringify(savedAddress));
    }
  }, [savedAddress]);

  const addCard = (card) => {
    const newCard = {
      ...card,
      id: Date.now(),
      displayNumber: card.number.substring(0, 7) + ' **** **** ' + card.number.substring(15)
    };
    setCards((prev) => [...prev, newCard]);
    return newCard;
  };

  const removeCard = (id) => {
    setCards((prev) => prev.filter(card => card.id !== id));
  };

  const saveAddress = (address) => {
    setShippingAddress(address);
  };

  return (
    <PaymentContext.Provider value={{ cards, addCard, removeCard, savedAddress, saveAddress }}>
      {children}
    </PaymentContext.Provider>
  );
};
