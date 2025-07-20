# Clean Architecture 구조 문서

이 프로젝트는 **Clean Architecture** 원칙을 따라 설계되었습니다.

## 📁 아키텍처 레이어

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│  │   Components    │ │ Context Hooks   │ │     Stores      │    │
│  │   (UI Logic)    │ │ (React Query)   │ │   (Zustand)     │    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Application Layer                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│  │   PostService   │ │   AuthService   │ │ServicesContext  │    │
│  │(Context Injected)│ │(Context Injected)│ │ (DI Provider)   │    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Domain Layer                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│  │Rich Entities    │ │   Repositories  │ │   Use Cases     │    │
│  │(Class + Logic)  │ │  (Interfaces)   │ │ (Business Logic)│    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │Domain Validators│ │ Custom Errors   │                       │
│  │(Validation)     │ │(Error Handling) │                       │
│  └─────────────────┘ └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│  │  API Repositories│ │   HTTP Client   │ │  External APIs  │    │
│  │ (Implementations)│ │    (Axios)      │ │(JSONPlaceholder)│    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 핵심 원칙

### 1. **Dependency Inversion Principle**
- Domain Layer는 외부 의존성이 없음 (순수한 비즈니스 로직)
- Use Cases는 Repository 인터페이스에만 의존
- Infrastructure Layer가 Domain의 인터페이스를 구현
- React Context를 통한 의존성 주입으로 테스트 용이성 확보

### 2. **Rich Domain Model**
- **Domain Entity**: 비즈니스 로직을 포함한 클래스 기반 모델
- **Infrastructure DTO**: 외부 API 응답/요청 스키마
- **Mapper**: DTO ↔ Entity 변환 담당 (Factory 패턴 활용)
- **Domain Validators**: 계층별 검증 로직 분리
- **Custom Errors**: 도메인별 구조화된 에러 처리

### 3. **Single Responsibility Principle**
- 각 레이어는 명확한 책임을 가짐
- Entity: 비즈니스 데이터 모델 + 도메인 로직 메서드
- DTO: 데이터 전송 객체 (네트워크 통신용)
- Repository: 데이터 접근 추상화
- Use Case: 비즈니스 로직 실행 + 에러 처리
- Service: Context 기반 의존성 조합
- Validator: 도메인별 검증 규칙
- Mapper: 데이터 변환

### 4. **Open/Closed Principle**
- 새로운 데이터 소스 추가 시 Repository 구현체만 교체
- 비즈니스 로직 변경 없이 UI 프레임워크 교체 가능
- API 스키마 변경 시 Mapper와 DTO만 수정
- Context Provider를 통한 유연한 의존성 교체

## 📂 폴더 구조

```
app/
├── domain/                          # 🔵 Domain Layer
│   ├── entities/                    # 비즈니스 엔티티 (클래스 기반)
│   │   ├── User.ts                  # 사용자 모델 + 비즈니스 로직
│   │   └── Post.ts                  # 게시글 모델 + 비즈니스 로직
│   ├── errors/                      # 도메인별 에러 클래스
│   │   └── DomainError.ts           # 커스텀 에러 시스템
│   ├── validation/                  # 도메인 검증 계층
│   │   ├── AuthValidator.ts         # 인증 검증 로직
│   │   └── PostValidator.ts         # 게시글 검증 로직
│   ├── repositories/                # Repository 인터페이스
│   │   ├── AuthRepository.ts        # 인증 추상화
│   │   └── PostRepository.ts        # 게시글 추상화
│   └── use-cases/                   # 비즈니스 로직
│       ├── auth.ts                  # 인증 Use Case + 에러 처리
│       └── posts.ts                 # 게시글 Use Case + 에러 처리
│
├── application/                     # 🟢 Application Layer
│   └── services/                    # Context 기반 서비스
│       ├── AuthService.ts           # 인증 서비스 (UseCase 래핑)
│       └── PostService.ts           # 게시글 서비스 (UseCase 래핑)
│
├── infrastructure/                  # 🟠 Infrastructure Layer
│   ├── dto/                         # 외부 API 스키마
│   │   ├── UserDto.ts               # 사용자 API DTO
│   │   └── PostDto.ts               # 게시글 API DTO
│   ├── mappers/                     # DTO ↔ Entity 변환
│   │   ├── UserMapper.ts            # 사용자 Mapper
│   │   └── PostMapper.ts            # 게시글 Mapper
│   └── repositories/                # Repository 구현체
│       ├── ApiAuthRepository.ts     # HTTP API 인증 구현
│       └── ApiPostRepository.ts     # HTTP API 게시글 구현
│
├── presentation/                    # 🟡 Presentation Layer
│   ├── components/                  # React 컴포넌트 (Atomic Design)
│   ├── hooks/                       # React Query Hooks (Context 사용)
│   ├── contexts/                    # React Context (DI 대체)
│   │   └── ServicesContext.tsx      # 서비스 의존성 주입
│   └── store/                       # Zustand 상태 관리
│
└── lib/                            # 🔧 공통 유틸리티
    ├── apiClient.ts                 # HTTP 클라이언트
    ├── queryKeys.ts                 # React Query 키 관리
    └── queryClient.ts               # Query 유틸리티
```

## 🔄 데이터 흐름

```
[UI Component] 
    ↓ (사용자 액션)
[React Hook (useAuthService/usePostService)] 
    ↓ (Context에서 Service 조회)
[ServicesContext]
    ↓ (Service 인스턴스 반환)
[Application Service] 
    ↓ (Use Case 메서드 호출)
[Domain Use Case] 
    ↓ (도메인 검증 + 비즈니스 로직)
[Domain Validator]
    ↓ (검증 통과 시 Repository 호출)
[Infrastructure Repository] 
    ↓ (HTTP 요청 - Entity → DTO 변환)
[External API]
    ↓ (HTTP 응답)
[Infrastructure Repository]
    ↓ (DTO → Entity 변환 via Mapper)
[Domain Entity (클래스)]
    ↓ (비즈니스 로직 적용)
[Domain Use Case]
    ↓ (처리된 Entity 반환)
[UI Component]
```

### 🔧 에러 처리 흐름

```
[Domain Validation]
    ↓ (검증 실패)
[Custom Domain Error]
    ↓ (구체적 에러 코드/타입)
[Use Case Error Handler]
    ↓ (비즈니스 컨텍스트 추가)
[Application Service]
    ↓ (에러 전파)
[React Hook]
    ↓ (UI 에러 처리)
[Error Boundary / Toast]
```

### 📤 Entity ↔ DTO 변환 흐름

```
Create/Update 요청:
[Domain Entity] → [Mapper] → [Request DTO] → [API]

Read 응답:
[API] → [Response DTO] → [Mapper] → [Domain Entity]
```

## 🧪 테스트 용이성

React Context 기반 구조의 장점:
- **Unit Test**: Mock Repository를 Context Provider에 주입하여 독립 테스트
- **Integration Test**: 실제 구현체를 사용한 전체 플로우 테스트
- **Component Test**: `<ServicesProvider>`로 래핑하여 컴포넌트 테스트
- **도메인 테스트**: 엔티티 비즈니스 로직을 순수 함수로 테스트

### 테스트 예시
```typescript
// Mock Repository 주입
<ServicesProvider 
  authRepository={mockAuthRepo} 
  postRepository={mockPostRepo}
>
  <TestComponent />
</ServicesProvider>

// Hook 테스트
const { result } = renderHook(() => useAuthService(), {
  wrapper: ServicesProvider
});
```

## 🔧 확장성

### 새로운 기능 추가 시:
1. `domain/entities`에 새 비즈니스 모델 클래스 추가
2. `domain/validation`에 검증 로직 추가
3. `domain/repositories`에 인터페이스 정의
4. `domain/use-cases`에 비즈니스 로직 구현
5. `infrastructure/dto`에 API 스키마 정의
6. `infrastructure/mappers`에 DTO ↔ Entity 변환 구현 (Factory 활용)
7. `infrastructure/repositories`에 구체적 구현
8. `contexts/ServicesContext`에 새 서비스 추가
9. `presentation/hooks`에 React Query + Context 통합

### API 스키마 변경 시:
1. `infrastructure/dto` 업데이트
2. `infrastructure/mappers` 업데이트 (Factory 메서드 수정)
3. Domain Layer와 Presentation Layer는 변경 불필요 ✅

### 비즈니스 로직 변경 시:
1. `domain/entities` 클래스 메서드 업데이트
2. `domain/validation` 검증 규칙 업데이트
3. `domain/use-cases` 업데이트
4. Infrastructure Layer와 Presentation Layer는 최소 변경 ✅

### 테스트 환경 설정 시:
1. Mock Repository 클래스 생성
2. `<ServicesProvider>`에 Mock 주입
3. 컴포넌트/Hook을 Provider로 래핑하여 테스트

## 📚 참고 자료

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [React Context API](https://react.dev/reference/react/useContext)
- [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) 