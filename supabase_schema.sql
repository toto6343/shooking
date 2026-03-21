-- 1. 상품 테이블 (Products)
CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    sizes INTEGER[] DEFAULT '{230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290}',
    out_of_stock_sizes INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 사용자 프로필 테이블 (Profiles)
-- Supabase Auth와 연동하여 사용자의 포인트 및 등급 관리
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    points INTEGER DEFAULT 5000,
    tier TEXT DEFAULT 'BRONZE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 주문 내역 테이블 (Orders)
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY, -- ORD-12345 형식
    user_id UUID REFERENCES public.profiles(id),
    items JSONB NOT NULL, -- [{productId, size, quantity, price}]
    total_amount INTEGER NOT NULL,
    shipping_info JSONB NOT NULL, -- {receiver, phone, address, message...}
    card_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 리뷰 테이블 (Reviews)
CREATE TABLE public.reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    user_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. 스타일 스냅 테이블 (Style Snaps)
CREATE TABLE public.style_snaps (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    user_name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. 위시리스트 테이블 (Wishlist)
CREATE TABLE public.wishlist (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- 7. 재입고 알림 테이블 (Restock Alerts)
CREATE TABLE public.restock_alerts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
    size INTEGER NOT NULL,
    is_notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- [샘플 데이터 삽입 - Products]
INSERT INTO public.products (name, brand, price, image, category, description, sizes, out_of_stock_sizes) VALUES
('에어 맥스 270', 'Nike', 159000, '/images/shoes/airmax270.jpg', '러닝화', '나이키의 혁신적인 에어 유닛이 탑재된 프리미엄 러닝화', '{230,240,250,260,270,280,290}', '{230,290}'),
('조던 1 레트로 하이', 'Nike', 189000, '/images/shoes/jordan1.jpg', '농구화', '스니커즈 문화의 아이콘 조던 1 레트로', '{230,240,250,260,270,280,290}', '{230,235,285}'),
('척 테일러 올스타', 'Converse', 69000, '/images/shoes/chukataylor.jpg', '캔버스화', '심플하고 유행을 타지 않는 클래식 캔버스화', '{220,230,240,250,260,270,280,290,300}', '{}'),
('울트라부스트 22', 'Adidas', 229000, '/images/shoes/ultraboost22.jpg', '러닝화', '최적의 에너지 리턴을 제공하는 러닝화', '{230,240,250,260,270,280,290}', '{260,265}'),
('뉴발란스 574', 'New Balance', 129000, '/images/shoes/newbalance574.jpg', '스니커즈', '뉴발란스의 아이코닉한 데일리 스니커즈', '{220,230,240,250,260,270,280,290}', '{270,280}');

-- [샘플 데이터 삽입 - Reviews]
-- user_id는 실제 가입 후 UUID로 업데이트가 필요하므로 여기서는 생략하거나 익명 처리 가능
INSERT INTO public.reviews (product_id, user_name, rating, content) VALUES
(1, '신발매니아', 5, '디자인이 너무 예뻐요! 배송도 빠르고 정사이즈입니다.'),
(1, '러너101', 4, '쿠셔닝이 생각보다 더 좋네요. 오래 걸어도 발이 안 아파요.'),
(2, '조던덕후', 5, '실물이 훨씬 영롱합니다. 역시 대장급!');

-- Row Level Security (RLS) 설정 (기본 보안)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "누구나 상품을 조회할 수 있음" ON public.products FOR SELECT USING (true);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "누구나 리뷰를 조회할 수 있음" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "인증된 사용자만 리뷰를 작성할 수 있음" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
