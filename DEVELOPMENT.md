# 개발 가이드

## 시작하기

### 필수 요구사항
- Node.js 16.x 이상
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

## 프로젝트 구조 설명

```
shooking-shop/
├── public/              # 정적 파일
│   └── images/         # 상품 이미지
├── src/
│   ├── components/     # React 컴포넌트
│   │   ├── Header.jsx           # 헤더 (장바구니 카운트)
│   │   ├── Header.module.css
│   │   ├── ProductCard.jsx      # 상품 카드
│   │   ├── ProductCard.module.css
│   │   ├── ProductList.jsx      # 상품 목록
│   │   └── ProductList.module.css
│   ├── data/
│   │   └── products.js          # 상품 데이터
│   ├── App.jsx                  # 메인 앱
│   ├── App.css
│   ├── main.jsx                 # 엔트리 포인트
│   └── index.css                # 글로벌 스타일
├── index.html
├── vite.config.js
└── package.json
```

## 컴포넌트 상세

### 1. Header 컴포넌트
**위치**: `src/components/Header.jsx`

**Props**:
- `cartCount` (number): 장바구니에 담긴 상품 개수

**기능**:
- 브랜드 로고 표시
- 장바구니 아이콘 + 카운트 표시
- 카운트 변경 시 애니메이션 효과

```jsx
<Header cartCount={cartItems.length} />
```

### 2. ProductCard 컴포넌트
**위치**: `src/components/ProductCard.jsx`

**Props**:
- `product` (object): 상품 정보
- `isInCart` (boolean): 장바구니 담김 여부
- `onToggleCart` (function): 장바구니 토글 핸들러

**기능**:
- 상품 이미지 표시
- 상품명, 가격 표시
- 담기/담김 버튼 토글
- 호버 효과

```jsx
<ProductCard
  product={product}
  isInCart={cartItems.includes(product.id)}
  onToggleCart={handleToggleCart}
/>
```

### 3. ProductList 컴포넌트
**위치**: `src/components/ProductList.jsx`

**Props**:
- `products` (array): 상품 목록
- `cartItems` (array): 장바구니 상품 ID 배열
- `onToggleCart` (function): 장바구니 토글 핸들러

**기능**:
- 2컬럼 그리드 레이아웃
- ProductCard 컴포넌트 렌더링

## 상태 관리

### App.jsx의 상태
```jsx
const [cartItems, setCartItems] = useState([]);
```

### 장바구니 토글 로직
```jsx
const handleToggleCart = (productId) => {
  setCartItems((prevItems) => {
    if (prevItems.includes(productId)) {
      return prevItems.filter((id) => id !== productId);
    } else {
      return [...prevItems, productId];
    }
  });
};
```

## 스타일링 가이드

### CSS 변수 (src/index.css)
```css
:root {
  --primary-color: #000000;      /* 검정 */
  --secondary-color: #ffffff;    /* 흰색 */
  --accent-color: #ff6b6b;       /* 강조색 (빨강) */
  --text-primary: #333333;       /* 주 텍스트 */
  --text-secondary: #666666;     /* 보조 텍스트 */
  --border-color: #e0e0e0;       /* 테두리 */
  --bg-color: #f5f5f5;           /* 배경 */
  --card-bg: #ffffff;            /* 카드 배경 */
}
```

### CSS Modules 사용
각 컴포넌트는 독립적인 CSS Module을 사용합니다.

```jsx
import styles from './Header.module.css';

<div className={styles.header}>
```

## 반응형 디자인

### 브레이크포인트
- 모바일: ~480px
- 태블릿: 481px~768px
- 데스크톱: 769px~

### 2컬럼 그리드 유지
모든 화면 크기에서 2컬럼 레이아웃을 유지합니다.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
```

## 데이터 추가/수정

### 상품 추가
`src/data/products.js` 파일 수정

```javascript
{
  id: 13,
  name: '새 상품',
  price: 150000,
  image: 'https://example.com/image.jpg',
  category: '카테고리'
}
```

### 이미지 변경
- Unsplash URL 사용 중
- 로컬 이미지 사용 시: `public/images/` 폴더에 추가

## 빌드 및 테스트

### 개발 빌드
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 성능 최적화

### 이미지 최적화
- 1:1 비율 유지
- WebP 형식 권장
- 500x500px 권장 크기

### 코드 스플리팅
현재는 단일 페이지이므로 불필요
향후 페이지 추가 시 React.lazy() 사용

## 트러블슈팅

### 개발 서버가 시작되지 않을 때
```bash
# 포트 충돌 확인
lsof -i :5173

# node_modules 재설치
rm -rf node_modules
npm install
```

### 스타일이 적용되지 않을 때
- CSS Module import 확인
- className vs class 확인
- 브라우저 캐시 삭제

### 장바구니 카운트가 업데이트되지 않을 때
- React DevTools로 상태 확인
- Props 전달 경로 확인

## 다음 단계

### 기능 추가 제안
1. 상품 필터링 (카테고리별)
2. 상품 검색
3. 장바구니 페이지
4. 좋아요 기능
5. 상품 상세 페이지

### 성능 개선
1. 이미지 lazy loading
2. 무한 스크롤
3. 상태 관리 라이브러리 (Zustand, Recoil)

## 코드 컨벤션

### 파일명
- 컴포넌트: PascalCase (Header.jsx)
- CSS Module: PascalCase.module.css
- 일반 파일: camelCase

### 변수명
- 상수: UPPER_CASE
- 함수: camelCase
- 컴포넌트: PascalCase

### 주석
```javascript
// 단일 라인 주석

/**
 * 다중 라인 주석
 * @param {number} id - 상품 ID
 */
```

## 참고 자료
- [React 공식 문서](https://react.dev)
- [Vite 공식 문서](https://vitejs.dev)
- [CSS Modules 가이드](https://github.com/css-modules/css-modules)
