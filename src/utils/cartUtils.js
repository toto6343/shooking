import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './constants';

export const calculateCartTotal = (cartItems, products) => {
  if (!products || products.length === 0 || !cartItems) {
    return { totalAmount: 0, shippingFee: 0, finalAmount: 0 };
  }

  const totalAmount = Object.entries(cartItems).reduce((sum, [itemKey, quantity]) => {
    const [productId] = itemKey.split('-');
    const product = products.find(p => p.id === Number(productId));
    return sum + (product ? product.price * quantity : 0);
  }, 0);

  const shippingFee = totalAmount >= FREE_SHIPPING_THRESHOLD || totalAmount === 0 ? 0 : SHIPPING_FEE;
  const finalAmount = totalAmount + shippingFee;

  return { totalAmount, shippingFee, finalAmount };
};
