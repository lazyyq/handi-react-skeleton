# Handi Frontend - Clean Architecture React App

이 프로젝트는 **Clean Architecture** 원칙을 따르는 React 애플리케이션입니다.

## 🏗️ 아키텍처

- **Clean Architecture**: 의존성 역전 원칙 적용
- **Atomic Design**: 체계적인 컴포넌트 구조
- **Domain-Driven Design**: 비즈니스 로직 중심 설계

## 🚀 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router v7
- **State Management**: Zustand (전역 상태), React Query (서버 상태)
- **UI Library**: Ant Design
- **HTTP Client**: Axios
- **Architecture**: Clean Architecture + Atomic Design

## 📁 프로젝트 구조

```
app/
├── domain/           # 🔵 Domain Layer (비즈니스 로직)
├── application/      # 🟢 Application Layer (서비스 조합)
├── infrastructure/   # 🟠 Infrastructure Layer (외부 의존성)
├── components/       # 🟡 Presentation Layer (UI)
├── hooks/           # React Query Hooks
├── store/           # Zustand 상태
└── lib/             # 공통 유틸리티
```

자세한 아키텍처 설명은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

## 🎯 주요 기능

- **인증 시스템**: 로그인/로그아웃 (테스트용 무조건 성공)
- **게시글 관리**: 목록 조회, 상세 보기 (JSONPlaceholder API)
- **반응형 UI**: 모바일/데스크톱 대응
- **에러 처리**: 전역 ErrorBoundary, 네트워크 에러 핸들링
- **개발자 도구**: React Query DevTools

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
