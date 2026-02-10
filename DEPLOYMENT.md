# 배포 가이드

## Vercel 배포 (권장)

### 1. Vercel 계정 준비
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인

### 2. GitHub 연동 배포
1. GitHub에 프로젝트 푸시
2. Vercel 대시보드에서 "New Project" 클릭
3. GitHub 저장소 선택
4. 자동으로 설정 감지 → "Deploy" 클릭
5. 배포 완료 후 URL 확인

### 3. CLI를 통한 배포
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

## Netlify 배포

### 1. 드래그 앤 드롭 방식
```bash
# 빌드
npm run build

# dist 폴더를 Netlify에 드래그 앤 드롭
```

### 2. CLI를 통한 배포
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy

# 프로덕션 배포
netlify deploy --prod
```

## GitHub Pages 배포

### 1. vite.config.js 수정
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/shooking-shop/' // GitHub 저장소 이름
})
```

### 2. 배포 스크립트 추가 (package.json)
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 3. gh-pages 설치 및 배포
```bash
npm install --save-dev gh-pages
npm run deploy
```

## 배포 후 확인 사항

- [ ] 모바일 화면에서 정상 작동
- [ ] 장바구니 기능 정상 작동
- [ ] 이미지 로딩 확인
- [ ] 반응형 레이아웃 확인
- [ ] 헤더 카운트 업데이트 확인

## 고객사 전달 항목

1. **테스트 URL**: https://shooking-shop.vercel.app (예시)
2. **접속 가능 기간**: 2026-02-05 ~ 2026-02-19
3. **테스트 계정**: 필요 시 생성
4. **피드백 수집**: 2026-02-19 리뷰 미팅

## 문제 해결

### 이미지가 로드되지 않는 경우
- public 폴더의 이미지 경로 확인
- Unsplash API 호출 제한 확인

### 빌드 에러 발생 시
```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 환경 변수 설정 (필요 시)
.env 파일 생성
```
VITE_API_URL=https://api.shooking.com
```
