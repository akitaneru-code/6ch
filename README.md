# 6ch - Anonymous Imageboard

2ch 스타일의 익명 이미지보드 스레드 웹사이트입니다.

## 기능

- 🧵 익명 스레드 작성 및 댓글 기능
- 🖼️ 이미지 업로드 지원
- ⚡ 실시간 업데이트
- 📱 반응형 디자인
- 🔗 2ch 스타일 UI

## 기술 스택

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (개발용) / PostgreSQL (배포용)
- **Image Storage**: Local filesystem / Cloud storage

## 설치 및 실행

### Prerequisites
- Node.js 16+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/akitaneru-code/6ch.git
cd 6ch

# 의존성 설치
npm install

# 환경 설정
cp .env.example .env

# 데이터베이스 초기화
npm run db:init

# 개발 서버 시작
npm run dev
```

### 배포

```bash
npm run build
npm start
```

## 프로젝트 구조

```
6ch/
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── components/   # 리액트 컴포넌트
│   │   ├── pages/        # 페이지
│   │   ├── styles/       # CSS 스타일
│   │   └── utils/        # 유틸리티
│   └── public/
├── backend/               # Express 백엔드
│   ├── src/
│   │   ├── routes/       # API 라우트
│   │   ├── models/       # 데이터베이스 모델
│   │   ├── controllers/  # 요청 처리
│   │   └── middleware/   # 미들웨어
│   └── uploads/          # 업로드된 이미지
├── .env.example
├── package.json
└── README.md
```

## API 문서

자세한 API 문서는 `/docs` 엔드포인트를 참조하세요.

## 라이선스

MIT

## 주의사항

이것은 완전히 익명의 커뮤니티 플랫폼입니다. 이용 시 관련 법률과 규칙을 준수해주세요.
