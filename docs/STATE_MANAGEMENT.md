# 상태 관리 가이드

Handi 프로젝트의 상태 관리 전략과 구현 방법에 대한 가이드입니다.

## 📋 목차

1. [상태 관리 개요](#상태-관리-개요)
2. [Zustand - 클라이언트 상태](#zustand---클라이언트-상태)
3. [React Query - 서버 상태](#react-query---서버-상태)
4. [상태 관리 패턴](#상태-관리-패턴)
5. [실제 사용 예시](#실제-사용-예시)

## 🎯 상태 관리 개요

Handi 프로젝트는 두 가지 주요 상태 관리 라이브러리를 사용합니다:

### 클라이언트 상태 (Zustand)
- 사용자 인증 정보
- UI 상태 (모달, 사이드바 등)
- 폼 상태
- 애플리케이션 설정

### 서버 상태 (React Query)
- API 데이터
- 캐싱
- 동기화
- 에러 처리

## 🏪 Zustand - 클라이언트 상태

### Store 구조

```typescript
// app/presentation/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  // 상태
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // 액션
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshUserInfo: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // 액션 구현
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const result = await userService.login(credentials)
          set({ 
            user: result.user, 
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },
      
      refreshUserInfo: async () => {
        try {
          const user = await userService.getCurrentUser()
          set({ user })
        } catch (error) {
          // 에러 처리
        }
      }
    }),
    {
      name: 'auth-storage', // localStorage 키
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
```

### Store 사용법

```typescript
import { useAuthStore } from '../stores/authStore'

// 컴포넌트에서 사용
const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  
  const handleLogin = async () => {
    try {
      await login({ email: 'test@example.com', password: 'password' })
    } catch (error) {
      console.error('로그인 실패:', error)
    }
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>안녕하세요, {user?.name}님!</p>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <button onClick={handleLogin}>로그인</button>
      )}
    </div>
  )
}
```

### Store 작성 가이드

#### 1. 타입 정의
```typescript
interface StoreState {
  // 상태
  data: DataType[]
  isLoading: boolean
  error: string | null
  
  // 액션
  fetchData: () => Promise<void>
  addData: (item: DataType) => void
  removeData: (id: string) => void
}
```

#### 2. Store 구현
```typescript
export const useDataStore = create<StoreState>((set, get) => ({
  // 초기 상태
  data: [],
  isLoading: false,
  error: null,
  
  // 액션
  fetchData: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await api.getData()
      set({ data, isLoading: false })
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      })
    }
  },
  
  addData: (item) => {
    const { data } = get()
    set({ data: [...data, item] })
  },
  
  removeData: (id) => {
    const { data } = get()
    set({ data: data.filter(item => item.id !== id) })
  }
}))
```

#### 3. Persistence 설정
```typescript
persist(
  (set, get) => ({
    // store 구현
  }),
  {
    name: 'store-name',
    partialize: (state) => ({
      // 저장할 상태만 선택
      data: state.data
    })
  }
)
```

## 🔄 React Query - 서버 상태

### Query 훅 구조

```typescript
// app/application/hooks/usePatients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientService } from '../services/PatientService'

// 환자 목록 조회
export const usePatients = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: () => patientService.getPatients(page, limit),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  })
}

// 환자 상세 조회
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatient(id),
    enabled: !!id, // id가 있을 때만 실행
  })
}

// 환자 생성
export const useCreatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

// 환자 수정
export const useUpdatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: patientService.updatePatient,
    onSuccess: (data, variables) => {
      // 캐시 업데이트
      queryClient.setQueryData(['patient', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
```

### Query 사용법

```typescript
import { usePatients, useCreatePatient } from '../hooks/usePatients'

const PatientsPage = () => {
  const { data, isLoading, error } = usePatients(1, 20)
  const createPatientMutation = useCreatePatient()
  
  const handleCreatePatient = async (patientData) => {
    try {
      await createPatientMutation.mutateAsync(patientData)
      message.success('환자가 성공적으로 등록되었습니다.')
    } catch (error) {
      message.error('환자 등록에 실패했습니다.')
    }
  }
  
  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러: {error.message}</div>
  
  return (
    <div>
      {data?.patients.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  )
}
```

### Query 설정 옵션

```typescript
const query = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
  
  // 캐싱 설정
  staleTime: 5 * 60 * 1000,    // 데이터가 신선한 시간
  cacheTime: 10 * 60 * 1000,   // 캐시 유지 시간
  
  // 재시도 설정
  retry: 3,                    // 재시도 횟수
  retryDelay: 1000,            // 재시도 간격
  
  // 조건부 실행
  enabled: condition,          // 조건이 true일 때만 실행
  
  // 콜백
  onSuccess: (data) => {
    console.log('성공:', data)
  },
  onError: (error) => {
    console.error('에러:', error)
  }
})
```

## 🎨 상태 관리 패턴

### 1. 관심사 분리

```typescript
// ❌ 잘못된 예시 - 모든 상태를 하나의 store에
const useGlobalStore = create((set) => ({
  user: null,
  patients: [],
  appointments: [],
  settings: {},
  // ... 너무 많은 상태
}))

// ✅ 올바른 예시 - 관심사별로 분리
const useAuthStore = create((set) => ({ user: null, login: () => {} }))
const usePatientStore = create((set) => ({ patients: [], fetchPatients: () => {} }))
const useAppointmentStore = create((set) => ({ appointments: [], fetchAppointments: () => {} }))
```

### 2. 불변성 유지

```typescript
// ❌ 잘못된 예시 - 직접 수정
const updatePatient = (id, updates) => {
  const { patients } = get()
  const patient = patients.find(p => p.id === id)
  patient.name = updates.name // 직접 수정
  set({ patients })
}

// ✅ 올바른 예시 - 불변성 유지
const updatePatient = (id, updates) => {
  const { patients } = get()
  set({
    patients: patients.map(patient =>
      patient.id === id ? { ...patient, ...updates } : patient
    )
  })
}
```

### 3. 비동기 처리

```typescript
// ❌ 잘못된 예시 - 에러 처리 없음
const fetchData = async () => {
  const data = await api.getData()
  set({ data })
}

// ✅ 올바른 예시 - 에러 처리 포함
const fetchData = async () => {
  set({ isLoading: true, error: null })
  try {
    const data = await api.getData()
    set({ data, isLoading: false })
  } catch (error) {
    set({ error: error.message, isLoading: false })
  }
}
```

## 📝 실제 사용 예시

### 인증 상태 관리

```typescript
// app/presentation/stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const result = await userService.login(credentials)
          set({ 
            user: result.user, 
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
        // 로컬 스토리지 정리
        localStorage.removeItem('auth-storage')
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
```

### 환자 데이터 관리

```typescript
// app/application/hooks/usePatients.ts
export const usePatients = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: () => patientService.getPatients(page, limit),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
```

### UI 상태 관리

```typescript
// app/presentation/stores/uiStore.ts
interface UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  language: 'ko' | 'en'
  
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'ko' | 'en') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      language: 'ko',
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language })
    }),
    {
      name: 'ui-settings'
    }
  )
)
```

## 🔧 디버깅 및 개발 도구

### React Query DevTools

```typescript
// app/root.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 애플리케이션 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Zustand DevTools

```typescript
import { devtools } from 'zustand/middleware'

export const useStore = create(
  devtools(
    (set) => ({
      // store 구현
    }),
    {
      name: 'store-name'
    }
  )
)
```

## 📚 추가 리소스

- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Zustand DevTools](https://github.com/zustandjs/zustand#devtools)

## 🤝 모범 사례

1. **Store 크기 제한**: 하나의 store가 너무 커지지 않도록 주의
2. **타입 안전성**: TypeScript를 활용한 타입 정의
3. **에러 처리**: 모든 비동기 작업에 에러 처리 포함
4. **성능 최적화**: 불필요한 리렌더링 방지
5. **테스트**: 상태 관리 로직에 대한 테스트 작성

---

이 가이드를 따라 효율적이고 유지보수하기 쉬운 상태 관리를 구현해주세요! 