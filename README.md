# 👟 슈킹(SHOOKING) - 차세대 하이브리드 스니커즈 플랫폼

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## 📋 프로젝트 개요

**슈킹(SHOOKING)**은 단순한 신발 쇼핑몰을 넘어, 몰입형 시각 경험과 소셜 커머스 기능이 결합된 **차세대 이커머스 플랫폼**입니다. 
기존의 정적인 쇼핑 경험에서 탈피하여 **360도 뷰어**, **실시간 커뮤니티**, **AI 기반 재고 예측** 등 현대적인 기술 스택을 총망라한 엔터프라이즈급 프로토타입입니다.

---

## ✨ 핵심 고도화 기능 (Ultra-HD Features)

### 1. 몰입형 시각 경험 (Immersive UX)
- **360° Interaction Mode**: 상세 페이지에서 신발을 마우스 드래그로 회전시켜 모든 각도의 디테일을 확인할 수 있는 인터랙티브 뷰어를 구현했습니다.
- **Image Zoom & Gallery**: 고해상도 상품 이미지를 전체 화면으로 확대하여 소재와 마감을 정밀하게 탐색할 수 있습니다.
- **Dark Mode Support**: 시스템 설정 및 수동 토글을 통한 완벽한 다크 모드 스타일링을 지원합니다.

### 2. 소셜 커머스 및 커뮤니티 (Social & Community)
- **Style Snap (OOTD)**: 사용자들이 직접 착용샷을 업로드하고 '좋아요'를 누르며 소통할 수 있는 인스타그램 스타일의 커뮤니티 피드를 구축했습니다.
- **Real-time Activity Ticker**: "누군가 방금 이 상품을 구매했습니다"와 같은 실시간 알림을 통해 사회적 증거(Social Proof)를 제공합니다.
- **Review System**: 텍스트와 별점이 포함된 영구적인 리뷰 시스템을 통해 상품 신뢰도를 확보했습니다.

### 3. 개인화 및 비즈니스 지능 (Intelligence & Retention)
- **AI-Driven Curation**: 사용자의 최근 탐색 이력을 분석하여 선호 브랜드 상품을 자동 추천하는 'Just for You' 섹션을 운영합니다.
- **Membership & Points**: 구매 금액에 따른 포인트 적립 및 등급(Bronze/Silver/Gold) 시스템과 등급별 자동 할인 로직을 적용했습니다.
- **Search Autocomplete**: 타이핑 시 실시간으로 상품명과 브랜드를 제안하여 탐색 경험을 최적화했습니다.
- **Restock Alerts**: 품절된 사이즈에 대한 재입고 알림 신청 기능을 통해 잠재 고객을 확보합니다.

### 4. 하이엔드 결제 및 유틸리티 (Advanced Utility)
- **Gifting Service**: 주소 없이 연락처와 메시지만으로 간편하게 신발을 선물할 수 있는 전용 결제 프로세스를 도입했습니다.
- **Upselling System**: 장바구니 분석을 통해 함께 구매하면 좋은 액세서리(양말, 슈케어 등)를 자동 추천합니다.
- **Global Toast System**: 모든 상태 피드백을 세련된 애니메이션 토스트 알림으로 일원화하여 crude한 alert을 배제했습니다.
- **Simple Payment UI**: 카카오페이, 네이버페이, 토스 등 현대적인 간편 결제 인터페이스를 완벽하게 구현했습니다.

---

## 🛠 기술 스택

| 구분 | 기술 |
| --- | --- |
| **Frontend** | React 18, React Router Dom v7, Framer Motion |
| **Backend/DB** | Supabase (PostgreSQL, Auth, Real-time) |
| **State** | Context API (User, Cart, Payment, Toast, Theme) |
| **Data Fetching** | TanStack Query (v5) |
| **Admin** | A/B Testing Engine, AI Inventory Prediction |

---

## 📦 데이터베이스 스키마 (`supabase_schema.sql`)

프로젝트는 다음 테이블들을 기반으로 유기적으로 작동하며, 전체 스키마는 루트의 `supabase_schema.sql`에 정의되어 있습니다.
- `products`: 상품 마스터 데이터 및 실시간 재고 정보
- `profiles`: 사용자 포인트, 등급, 기본 정보
- `orders`: 일반/선물 주문 내역 및 배송 정보
- `reviews`: 사용자 별점 및 상품 후기
- `style_snaps`: 유저 착용샷 및 좋아요 데이터
- `wishlist`: 찜한 상품 목록
- `restock_alerts`: 재입고 알림 예약 데이터

---

## 🚀 시작하기

### 1. 데이터베이스 설정
- Supabase 프로젝트 생성 후 **SQL Editor**에서 `supabase_schema.sql` 내용을 실행하여 테이블과 샘플 데이터를 생성합니다.

### 2. 환경 변수 설정 (`.env`)
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 2. 설치 및 실행
```bash
npm install
npm run dev
```

---

**Last Updated**: 2026-03-21  
**Version**: 4.0.0 (Ultra-Next Gen)  
**Developer**: 김우혁 / 슈킹 플랫폼 전략팀 협업 프로젝트
