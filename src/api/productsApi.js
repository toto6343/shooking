import { supabase } from './supabase';

// Fetch all products from Supabase
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('상품 목록을 불러오는 중 오류가 발생했습니다.');
  }

  return data;
};

// Fetch single product by ID from Supabase
export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw new Error('상품 정보를 불러오는 중 오류가 발생했습니다.');
  }

  return data;
};
