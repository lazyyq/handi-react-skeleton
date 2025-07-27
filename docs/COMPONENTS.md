# 컴포넌트 가이드

Handi 프로젝트의 컴포넌트 구조와 사용법에 대한 가이드입니다.

## 📋 목차

1. [Atomic Design Pattern](#atomic-design-pattern)
2. [컴포넌트 계층 구조](#컴포넌트-계층-구조)
3. [공통 컴포넌트](#공통-컴포넌트)
4. [페이지별 컴포넌트](#페이지별-컴포넌트)
5. [컴포넌트 작성 가이드](#컴포넌트-작성-가이드)

## 🧩 Atomic Design Pattern

Handi 프로젝트는 Atomic Design 패턴을 따릅니다. 이 패턴은 UI 컴포넌트를 5단계로 분류합니다:

### 1. Atoms (원자)
가장 기본적인 UI 컴포넌트입니다.

**위치**: `app/presentation/components/atoms/`

**예시**:
- `Button.tsx` - 버튼 컴포넌트
- `Input.tsx` - 입력 필드 컴포넌트
- `Card.tsx` - 카드 컨테이너 컴포넌트

**특징**:
- 재사용 가능한 최소 단위
- 특정 기능에 종속되지 않음
- Props를 통한 커스터마이징

### 2. Molecules (분자)
여러 Atoms를 조합한 복합 컴포넌트입니다.

**위치**: 페이지별 디렉토리 내 `components/` 폴더

**예시**:
- `LoginForm.tsx` - 로그인 폼 (login 디렉토리)
- `PatientCard.tsx` - 환자 정보 카드 (nurse/components 디렉토리)

**특징**:
- 특정 기능에 특화
- 페이지나 기능에 종속적
- 비즈니스 로직 포함 가능

### 3. Organisms (유기체)
Molecules와 Atoms를 조합한 큰 단위 컴포넌트입니다.

**위치**: `app/presentation/components/templates/components/`

**예시**:
- `Header.tsx` - 애플리케이션 헤더
- `Sidebar.tsx` - 네비게이션 사이드바

**특징**:
- 페이지의 주요 섹션을 구성
- 복잡한 레이아웃과 로직 포함

### 4. Templates (템플릿)
페이지의 레이아웃을 정의합니다.

**위치**: `app/presentation/components/templates/`

**예시**:
- `AppLayout.tsx` - 메인 애플리케이션 레이아웃

**특징**:
- 페이지 구조 정의
- Organisms 배치
- 실제 데이터는 포함하지 않음

### 5. Pages (페이지)
실제 데이터가 포함된 완성된 페이지입니다.

**위치**: `app/presentation/pages/`

**예시**:
- `Home.tsx` - 메인 페이지
- `Login.tsx` - 로그인 페이지
- `Dashboard.tsx` - 간호사 대시보드

## 🏗 컴포넌트 계층 구조

```
📂 app/presentation/
├── 📂 components/
│   ├── 📂 atoms/                    # 공통 기본 컴포넌트
│   │   ├── 📄 Button.tsx
│   │   ├── 📄 Input.tsx
│   │   ├── 📄 Card.tsx
│   │   └── 📄 index.ts
│   └── 📂 templates/                # 레이아웃 템플릿
│       ├── 📄 AppLayout.tsx
│       └── 📂 components/           # 레이아웃 전용 컴포넌트
│           ├── 📄 Header.tsx
│           └── 📄 Sidebar.tsx
└── 📂 pages/
    ├── 📂 home/
    │   └── 📄 Home.tsx
    ├── 📂 login/
    │   ├── 📄 Login.tsx
    │   └── 📄 LoginForm.tsx         # 페이지 전용 컴포넌트
    ├── 📂 nurse/
    │   ├── 📄 Dashboard.tsx
    │   ├── 📄 Patients.tsx
    │   └── 📂 components/           # 간호사 페이지 전용
    │       └── 📄 PatientCard.tsx
    └── 📂 admin/
        ├── 📄 Hospital.tsx
        └── 📄 Settings.tsx
```

## 🎯 공통 컴포넌트

### Atoms

#### Button
```typescript
import { Button } from '../components/atoms'

// 사용 예시
<Button type="primary" size="large" onClick={handleClick}>
  로그인
</Button>
```

**Props**:
- `type`: 'primary' | 'default' | 'dashed' | 'link' | 'text'
- `size`: 'large' | 'middle' | 'small'
- `loading`: boolean
- `disabled`: boolean
- `onClick`: () => void

#### Input
```typescript
import { Input } from '../components/atoms'

// 사용 예시
<Input 
  label="이메일"
  placeholder="이메일을 입력하세요"
  error="올바른 이메일을 입력해주세요"
/>
```

**Props**:
- `label`: string
- `error`: string
- `placeholder`: string
- 기타 Ant Design Input props

#### Card
```typescript
import { Card } from '../components/atoms'

// 사용 예시
<Card title="환자 정보" hoverable>
  <p>환자 상세 정보...</p>
</Card>
```

**Props**:
- `title`: ReactNode
- `hoverable`: boolean
- `onClick`: () => void
- 기타 Ant Design Card props

## 📄 페이지별 컴포넌트

### Login 페이지
- **LoginForm**: 로그인 폼 컴포넌트
  - 역할 선택 (간호사/관리자)
  - 이메일/비밀번호 입력
  - 폼 검증 및 제출

### Nurse 페이지
- **PatientCard**: 환자 정보 카드
  - 환자 기본 정보 표시
  - 클릭 시 상세 페이지로 이동
  - 성별, 나이, 연락처 정보

### Templates
- **Header**: 애플리케이션 헤더
  - 서비스 로고/이름
  - 사용자 정보 및 로그아웃
- **Sidebar**: 네비게이션 사이드바
  - 역할별 메뉴 표시
  - 현재 페이지 하이라이트
- **AppLayout**: 메인 레이아웃
  - Header와 Sidebar 조합
  - 인증 상태에 따른 조건부 렌더링

## 📝 컴포넌트 작성 가이드

### 1. 파일 구조
```typescript
// 1. Import
import React from 'react'
import { SomeAntComponent } from 'antd'

// 2. Types
interface ComponentProps {
  title: string
  onClick?: () => void
  children?: React.ReactNode
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ 
  title, 
  onClick, 
  children 
}) => {
  return (
    <div onClick={onClick}>
      <h1>{title}</h1>
      {children}
    </div>
  )
}

// 4. Export
export default Component
```

### 2. Props 정의
```typescript
interface ComponentProps {
  // 필수 props
  required: string
  
  // 선택적 props
  optional?: number
  
  // 함수 props
  onAction?: (value: string) => void
  
  // React Node
  children?: React.ReactNode
  
  // HTML 속성 확장
  className?: string
  style?: React.CSSProperties
}
```

### 3. 스타일링
```typescript
// TailwindCSS 클래스 사용
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// 조건부 스타일링
<div className={`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}>

// 반응형 디자인
<div className="w-full md:w-1/2 lg:w-1/3">
```

### 4. 이벤트 처리
```typescript
const handleClick = (event: React.MouseEvent) => {
  event.preventDefault()
  // 이벤트 처리 로직
}

const handleSubmit = async (values: any) => {
  try {
    await submitData(values)
    message.success('성공적으로 처리되었습니다.')
  } catch (error) {
    message.error('처리 중 오류가 발생했습니다.')
  }
}
```

### 5. 상태 관리
```typescript
// 로컬 상태
const [isLoading, setIsLoading] = useState(false)
const [data, setData] = useState<DataType[]>([])

// 커스텀 훅 사용
const { data: patients, isLoading } = usePatients()
const { user, login } = useAuthStore()
```

## 🔧 컴포넌트 테스트

### 테스트 파일 구조
```
📂 __tests__/
├── 📄 ComponentName.test.tsx
└── 📄 ComponentName.spec.tsx
```

### 테스트 예시
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Component } from '../Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="테스트" />)
    expect(screen.getByText('테스트')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Component title="테스트" onClick={handleClick} />)
    
    fireEvent.click(screen.getByText('테스트'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 📚 추가 리소스

- [Ant Design 컴포넌트 문서](https://ant.design/components/overview/)
- [TailwindCSS 문서](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript React 가이드](https://www.typescriptlang.org/docs/handbook/react.html)

## 🤝 기여 가이드

새로운 컴포넌트를 추가할 때:

1. **적절한 계층 선택**: Atomic Design 패턴에 따라 적절한 계층 선택
2. **타입 정의**: TypeScript 인터페이스 정의
3. **문서화**: Props와 사용법 문서화
4. **테스트 작성**: 기본적인 테스트 케이스 작성
5. **스타일링**: TailwindCSS와 Ant Design 활용

---

이 가이드를 따라 일관성 있고 유지보수하기 쉬운 컴포넌트를 작성해주세요! 