# 슈킹(SHOOKING) 온라인 쇼핑몰 - 고도화 버전

## 📋 프로젝트 개요

**슈킹(SHOOKING)**은 20~30대 젊은 세대를 대상으로 한 프리미엄 신발 전문 쇼핑몰입니다. 
본 프로젝트는 초기 요구사항을 넘어 **React Router**를 통한 정교한 페이지 전환, **Context API**를 활용한 전역 상태 관리, 그리고 **사용자 경험(UX) 고도화**를 목표로 개발되었습니다.

## ✨ 고도화된 주요 기능

### 1. 전역 상태 관리 및 데이터 영속성 (Advanced State Management)
- **Context API & Custom Hooks**: `CartContext`를 통해 장바구니 상태를 전역적으로 관리합니다. 어느 페이지에서든 실시간으로 장바구니 수량을 확인하고 상품을 추가/삭제할 수 있습니다.
- **LocalStorage 연동**: 페이지를 새로고침하거나 브라우저를 닫았다가 다시 열어도 장바구니에 담긴 상품 정보가 유지됩니다.

### 2. 정교한 라우팅 시스템 (Professional Routing)
- **React Router Dom (v6)** 적용:
  - `/`: 메인 상품 목록 페이지
  - `/product/:id`: 상품 상세 정보 페이지 (동적 라우팅)
  - `/cart`: 장바구니 관리 페이지
- **자연스러운 페이지 흐름**: 브라우저의 뒤로가기/앞으로가기 기능을 완벽히 지원하며, 컴포넌트 간 유기적인 데이터 흐름을 보장합니다.

### 3. 실시간 인터랙션 피드백 (Toast Notification)
- **토스트 알림 시스템**: 상품을 장바구니에 담거나 삭제할 때 하단에 세련된 알림 창을 띄워 사용자에게 즉각적인 피드백을 제공합니다.
- **실시간 카운팅**: 헤더의 장바구니 아이콘에 담긴 총 수량이 실시간으로 반영됩니다.

### 4. 상품 탐색 고도화 (Filtering & Discovery)
- **카테고리 필터링**: 러닝화, 스니커즈, 농구화 등 카테고리별로 상품을 분류하여 탐색할 수 있는 필터 바를 제공합니다.
- **연관 상품 추천**: 상세 페이지 하단에 동일 브랜드의 다른 상품들을 추천하여 구매 전환율을 높입니다.

### 5. 쇼핑 및 결제 프로세스 최적화 (Optimized UX)
- **수량 조절 기능**: 장바구니 내에서 각 상품의 수량을 실시간으로 조절하고 그에 따른 금액 변화를 확인할 수 있습니다.
- **배송비 정책**: 총 주문 금액이 **100,000원 이상 시 배송비 무료** 정책이 자동 적용됩니다.
- **결제 모달 시스템**: 카드 번호 입력(마스킹 지원), 결제 확인, 로딩 애니메이션, 결제 완료로 이어지는 4단계 결제 시뮬레이션을 구현했습니다.

## 🛠 기술 스택

- **Frontend**: React 18
- **Routing**: React Router Dom
- **State Management**: Context API
- **Styling**: CSS Modules (Scoped CSS)
- **Build Tool**: Vite

## 📦 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── Header           # 로고 및 장바구니 카운트
│   ├── ProductList      # 카테고리 필터 및 그리드 레이아웃
│   ├── ProductCard      # 상품 카드 및 담기 토글
│   ├── ProductDetail    # 상세 정보 및 추천 상품
│   ├── Cart             # 수량 조절 및 금액 계산
│   └── PaymentModal     # 4단계 결제 프로세스
├── context/
│   └── CartContext.jsx  # 전역 상태 및 LocalStorage 로직
├── data/
│   └── products.js      # 고도화된 상품 메타데이터
├── App.jsx              # 라우팅 구성 및 메인 레이아웃
└── index.css            # 글로벌 테마 변수 (Brand Color)
```

## 🎨 디자인 가이드

- **Primary Color**: `#000000` (Modern Black)
- **Accent Color**: `#ff6b6b` (Point Red)
- **Layout**: 2컬럼 그리드 기반의 모바일 퍼스트 반응형 레이아웃
- **Typography**: 가독성 중심의 시스템 폰트 및 굵기 최적화

## 🚀 시작하기

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

---

**Last Updated**: 2026-03-20  
**Version**: 2.0.0 (Advanced Version)
