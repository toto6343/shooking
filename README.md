# 👟 슈킹(SHOOKING) - 프리미엄 스니커즈 플랫폼

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## 📋 프로젝트 개요

**슈킹(SHOOKING)**은 몰입형 시각 경험과 실시간 데이터 연동이 결합된 **차세대 이커머스 플랫폼**입니다. 
단순한 기획안이 아닌, **Supabase 백엔드 연동**, **360도 인터랙티브 뷰어**, **실시간 알림 시스템** 등 현대적인 프론트엔드 기술을 총망라하여 실제 서비스가 가능한 수준으로 구현되었습니다.

---

## 📸 주요 기능 시연 (Actual Project Screenshots)

### 1. 메인 상품 목록 및 인텔리전트 큐레이션
<p align="center">
  <img src="/images/screenshots/main.png" width="90%" alt="메인 화면">
  <br>
  <em>[그림 1] 카테고리 필터링, 검색, 그리고 최근 본 상품 기반의 AI 맞춤 추천 섹션</em>
</p>

### 2. 360° 인터랙티브 상품 상세 페이지
<p align="center">
  <img src="/images/screenshots/product.png" width="90%" alt="상품 상세 화면">
  <br>
  <em>[그림 2] 360도 드래그 회전 뷰어, 실시간 재고 기반 사이즈 선택 및 재입고 알림 신청</em>
</p>

### 3. 실시간 장바구니 및 동적 주문 관리
<p align="center">
  <img src="/images/screenshots/cart.png" width="90%" alt="장바구니 화면">
  <br>
  <em>[그림 3] 수량 조절 시 실시간 금액 계산 로직 및 애니메이션 기반의 장바구니 UI</em>
</p>

### 4. 스타일 스냅 (사용자 커뮤니티)
<p align="center">
  <img src="/images/screenshots/community.png" width="90%" alt="커뮤니티 화면">
  <br>
  <em>[그림 4] 사용자들이 직접 업로드한 착용샷 공유 및 소통을 위한 스타일 피드</em>
</p>

---

## ✨ 핵심 기술적 성취 (Technical Highlights)

### 🛠 최신 스택 기반의 견고한 설계
- **서버 상태 관리**: `TanStack Query`를 활용하여 API 호출 최소화 및 데이터 캐싱 최적화.
- **실시간 데이터 연동**: `Supabase (PostgreSQL)`와 실시간 통신하여 주문 내역 및 리뷰를 영구 저장.
- **몰입형 UX/UI**: `Framer Motion`을 통한 페이지 전환 애니메이션 및 마우스 드래그 기반의 360도 신발 뷰어 구현.
- **반응형 아키텍처**: CSS Modules를 활용하여 모바일과 데스크톱 모두에서 완벽한 2컬럼 그리드 레이아웃 유지.

### 🧩 도메인 중심 상태 관리 (Context API)
- `CartContext`: 전역 장바구니 상태 및 로컬 스토리지 연동.
- `ToastContext`: 실시간 활동(Activity Ticker) 및 시스템 피드백 알림 통합 관리.
- `ThemeContext`: 시스템 설정 연동 및 수동 토글이 가능한 완벽한 다크 모드 지원.

### 🔗 실시간 서비스 접속
- **배포 URL**: [https://shooking-ten.vercel.app/](https://shooking-ten.vercel.app/)

---

## 🚀 시작하기

### 1. 환경 변수 설정 (`.env`)
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

**Last Updated**: 2026-03-28  
**Version**: 5.0.0 (Final Production Ready)  
**Developer**: 김우혁 / 슈킹 플랫폼 전략팀 협업 프로젝트
