# Handi - 환자 관리 서비스

Handi는 간호사와 관리자를 위한 현대적인 환자 관리 서비스입니다. React 19, TypeScript, 그리고 최신 웹 기술을 활용하여 구축되었습니다.

## 🚀 주요 기능

### 간호사 모드
- **대시보드**: 관리 중인 환자 목록과 개인 일정 확인
- **상담 관리**: 30분 단위 타임슬롯으로 상담 일정 설정
- **환자 관리**: 환자 목록 조회 및 상세 정보 확인
- **환자 상세**: 혈압, 혈당, 체온 등 건강 데이터 그래프 표시
- **화상 상담**: 실시간 화상 상담 기능

### 관리자 모드
- **병원 관리**: 등록된 간호사 및 환자 목록 관리
- **설정**: 시스템 설정 및 관리

## 🛠 기술 스택

### Frontend
- **React 19** - 최신 React 버전
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 환경
- **React Router v7** - 클라이언트 사이드 라우팅
- **TailwindCSS** - 유틸리티 우선 CSS 프레임워크
- **Ant Design** - 엔터프라이즈급 UI 컴포넌트

### 상태 관리 & 데이터 페칭
- **Zustand** - 경량 상태 관리
- **TanStack Query (React Query)** - 서버 상태 관리
- **Axios** - HTTP 클라이언트

### 차트 & 날짜
- **Recharts** - 데이터 시각화
- **Day.js** - 경량 날짜 라이브러리

## 📁 프로젝트 구조

```
handi-frontend/
├── 📂 app/
│   ├── 📂 domain/                    # 도메인 계층
│   │   └── 📂 entities/              # 도메인 엔티티
│   │       ├── 📄 User.ts            # 사용자 관련 인터페이스
│   │       └── 📄 Patient.ts         # 환자 관련 인터페이스
│   │
│   ├── 📂 infrastructure/            # 인프라 계층
│   │   ├── 📂 api/                   # API 통신
│   │   │   ├── 📄 httpClient.ts      # Axios 설정
│   │   │   ├── 📄 userApi.ts         # 사용자 API
│   │   │   └── 📄 patientApi.ts      # 환자 API
│   │   └── 📂 dto/                   # 데이터 전송 객체
│   │       ├── 📄 UserDto.ts         # 사용자 DTO
│   │       └── 📄 PatientDto.ts      # 환자 DTO
│   │
│   ├── 📂 application/               # 애플리케이션 계층
│   │   ├── 📂 services/              # 비즈니스 서비스
│   │   │   ├── 📄 UserService.ts     # 사용자 서비스
│   │   │   └── 📄 PatientService.ts  # 환자 서비스
│   │   ├── 📂 hooks/                 # 커스텀 훅
│   │   │   ├── 📄 useUsers.ts        # 사용자 관련 훅
│   │   │   └── 📄 usePatients.ts     # 환자 관련 훅
│   │   └── 📂 mappers/               # DTO-Entity 변환
│   │       ├── 📄 UserMapper.ts      # 사용자 매퍼
│   │       └── 📄 PatientMapper.ts   # 환자 매퍼
│   │
│   ├── 📂 presentation/              # 프레젠테이션 계층
│   │   ├── 📂 components/            # 공통 컴포넌트
│   │   │   ├── 📂 atoms/             # Atomic Design - Atoms
│   │   │   │   ├── 📄 Button.tsx     # 버튼 컴포넌트
│   │   │   │   ├── 📄 Input.tsx      # 입력 컴포넌트
│   │   │   │   ├── 📄 Card.tsx       # 카드 컴포넌트
│   │   │   │   └── 📄 index.ts       # 내보내기
│   │   │   └── 📂 templates/         # Atomic Design - Templates
│   │   │       ├── 📄 AppLayout.tsx  # 메인 레이아웃
│   │   │       └── 📂 components/    # 레이아웃 전용 컴포넌트
│   │   │           ├── 📄 Header.tsx # 헤더 컴포넌트
│   │   │           └── 📄 Sidebar.tsx # 사이드바 컴포넌트
│   │   │
│   │   ├── 📂 pages/                 # 페이지 컴포넌트
│   │   │   ├── 📂 home/              # 홈 페이지
│   │   │   │   └── 📄 Home.tsx       # 메인 페이지
│   │   │   ├── 📂 login/             # 로그인 페이지
│   │   │   │   ├── 📄 Login.tsx      # 로그인 페이지
│   │   │   │   └── 📄 LoginForm.tsx  # 로그인 폼 (페이지 전용)
│   │   │   ├── 📂 nurse/             # 간호사 모드 페이지
│   │   │   │   ├── 📄 Dashboard.tsx  # 간호사 대시보드
│   │   │   │   ├── 📄 Patients.tsx   # 환자 목록
│   │   │   │   ├── 📄 PatientDetail.tsx # 환자 상세
│   │   │   │   ├── 📄 Consultation.tsx # 상담 관리
│   │   │   │   ├── 📄 VideoCall.tsx  # 화상 상담
│   │   │   │   └── 📂 components/    # 간호사 페이지 전용 컴포넌트
│   │   │   │       └── 📄 PatientCard.tsx # 환자 카드
│   │   │   └── 📂 admin/             # 관리자 모드 페이지
│   │   │       ├── 📄 Hospital.tsx   # 병원 관리
│   │   │       └── 📄 Settings.tsx   # 설정
│   │   │
│   │   └── 📂 stores/                # 상태 관리
│   │       └── 📄 authStore.ts       # 인증 상태 관리
│   │
│   ├── 📄 root.tsx                   # 애플리케이션 루트
│   ├── 📄 routes.ts                  # 라우팅 설정
│   └── 📄 app.css                    # 전역 스타일
│
├── 📂 docs/                          # 문서
│   └── 📄 API_ENDPOINTS.md           # API 엔드포인트 문서
│
├── 📄 package.json                   # 프로젝트 설정
├── 📄 tsconfig.json                  # TypeScript 설정
├── 📄 vite.config.ts                 # Vite 설정
└── 📄 README.md                      # 프로젝트 문서
```

## 🏗 아키텍처 패턴

### 1. Layered Architecture (계층형 아키텍처)
```
┌─────────────────────────────────────┐
│        Presentation Layer           │ ← UI, 컴포넌트, 상태 관리
├─────────────────────────────────────┤
│       Application Layer             │ ← 비즈니스 로직, 서비스, 훅
├─────────────────────────────────────┤
│        Domain Layer                 │ ← 엔티티, 도메인 로직
├─────────────────────────────────────┤
│     Infrastructure Layer            │ ← API, 외부 서비스
└─────────────────────────────────────┘
```

### 2. Atomic Design Pattern
```
Atoms (원자) → Molecules (분자) → Organisms (유기체) → Templates (템플릿) → Pages (페이지)
```

- **Atoms**: Button, Input, Card 등 기본 UI 컴포넌트
- **Molecules**: LoginForm, PatientCard 등 복합 컴포넌트
- **Organisms**: Header, Sidebar 등 큰 단위 컴포넌트
- **Templates**: AppLayout 등 페이지 레이아웃
- **Pages**: 실제 페이지 컴포넌트

### 3. DTO-Entity Pattern
- **DTO (Data Transfer Object)**: API 통신용 데이터 구조
- **Entity**: 도메인 로직용 데이터 구조
- **Mapper**: DTO와 Entity 간 변환 로직

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다.

### 빌드
```bash
npm run build
```

### TypeScript 검사
```bash
npx tsc
```

## 🔐 인증

현재 데모 모드로 구현되어 있어 임의의 이메일과 비밀번호로 로그인할 수 있습니다.

### 사용자 역할
- **간호사 (NURSE)**: 환자 관리, 상담 일정 관리
- **관리자 (ADMIN)**: 병원 전체 관리

## 📊 상태 관리

### Zustand Store
- `authStore`: 사용자 인증 상태 관리
- 로그인/로그아웃 기능
- 사용자 정보 저장

### React Query
- 서버 상태 관리
- 캐싱 및 동기화
- 에러 처리

## 🎨 스타일링

### TailwindCSS
- 유틸리티 우선 CSS 프레임워크
- 반응형 디자인
- 커스터마이징 가능

### Ant Design
- 엔터프라이즈급 UI 컴포넌트
- 일관된 디자인 시스템
- 접근성 고려

## 📝 코드 컨벤션

### 파일 명명
- 컴포넌트: PascalCase (예: `PatientCard.tsx`)
- 유틸리티: camelCase (예: `userApi.ts`)
- 상수: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.md`)

### Import 순서
1. React 관련
2. 외부 라이브러리
3. 내부 컴포넌트
4. 타입 정의

### 컴포넌트 구조
```typescript
// 1. Import
import React from 'react'

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ ... }) => {
  // ...
}

// 4. Export
export default Component
```

## 🔧 개발 가이드

### 새 페이지 추가
1. `app/presentation/pages/` 하위에 디렉토리 생성
2. 페이지 컴포넌트 생성
3. `app/routes.ts`에 라우트 추가

### 새 컴포넌트 추가
1. Atomic Design 패턴에 따라 적절한 계층 선택
2. `app/presentation/components/` 하위에 생성
3. 타입 정의 및 스타일링

### API 연동
1. `app/infrastructure/dto/`에 DTO 정의
2. `app/infrastructure/api/`에 API 함수 구현
3. `app/application/mappers/`에 변환 로직 구현
4. `app/application/services/`에 비즈니스 로직 구현
5. `app/application/hooks/`에 React Query 훅 구현

## 📚 추가 문서

- [API 엔드포인트 문서](./docs/API_ENDPOINTS.md)
- [컴포넌트 가이드](./docs/COMPONENTS.md) (추후 작성 예정)
- [상태 관리 가이드](./docs/STATE_MANAGEMENT.md) (추후 작성 예정)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
