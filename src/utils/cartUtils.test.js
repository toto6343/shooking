import { describe, it, expect } from 'vitest';
import { calculateCartTotal } from './cartUtils';
import { SHIPPING_FEE } from './constants';

describe('calculateCartTotal', () => {
  const mockProducts = [
    { id: 1, price: 30000 },
    { id: 2, price: 50000 },
    { id: 3, price: 80000 },
  ];

  it('빈 장바구니일 때 금액이 0이어야 한다.', () => {
    const result = calculateCartTotal({}, mockProducts);
    expect(result.totalAmount).toBe(0);
    expect(result.shippingFee).toBe(0);
    expect(result.finalAmount).toBe(0);
  });

  it('10만원 미만일 경우 배송비가 추가되어야 한다.', () => {
    // 30,000 * 2 = 60,000 (배송비 발생)
    const cartItems = { 1: 2 };
    const result = calculateCartTotal(cartItems, mockProducts);
    expect(result.totalAmount).toBe(60000);
    expect(result.shippingFee).toBe(SHIPPING_FEE);
    expect(result.finalAmount).toBe(60000 + SHIPPING_FEE);
  });

  it('10만원 이상일 경우 배송비가 무료여야 한다.', () => {
    // 80,000 * 2 = 160,000 (무료 배송)
    const cartItems = { 3: 2 };
    const result = calculateCartTotal(cartItems, mockProducts);
    expect(result.totalAmount).toBe(160000);
    expect(result.shippingFee).toBe(0);
    expect(result.finalAmount).toBe(160000);
  });
});
