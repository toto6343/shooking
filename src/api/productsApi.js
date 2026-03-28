import { supabase } from './supabase';
import { products as localProducts } from '../data/products';

// Helper to map DB columns to frontend camelCase
const mapProductData = (p) => ({
  ...p,
  outOfStockSizes: p.out_of_stock_sizes || []
});

// Fetch all products from Supabase
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(mapProductData);
    }
    
    console.warn('Supabase에 상품 데이터가 없어 로컬 데이터를 사용합니다.');
    return localProducts;
  } catch (err) {
    console.error('Supabase 연동 실패, 로컬 데이터를 사용합니다:', err.message);
    return localProducts;
  }
};

// Fetch single product by ID from Supabase
export const fetchProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Use maybeSingle to avoid error when 0 rows found

    if (error) throw error;
    
    if (data) {
      return mapProductData(data);
    }
    
    const local = localProducts.find(p => p.id === parseInt(id));
    return local || null; // Return null instead of undefined
  } catch (err) {
    console.error(`ID ${id} 상품 연동 실패, 로컬 데이터를 확인합니다:`, err.message);
    const local = localProducts.find(p => p.id === parseInt(id));
    return local || null;
  }
};
