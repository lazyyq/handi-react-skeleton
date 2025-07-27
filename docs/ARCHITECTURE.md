# 아키텍처 가이드

Handi 프로젝트의 아키텍처 설계 원칙과 구현 방법에 대한 가이드입니다.

## 📋 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [Layered Architecture](#layered-architecture)
3. [Domain-Driven Design](#domain-driven-design)
4. [DTO-Entity Pattern](#dto-entity-pattern)
5. [의존성 관리](#의존성-관리)
6. [실제 구현 예시](#실제-구현-예시)

## 🏗 아키텍처 개요

Handi 프로젝트는 **Clean Architecture**와 **Domain-Driven Design** 원칙을 기반으로 설계되었습니다.

### 핵심 원칙

1. **관심사 분리 (Separation of Concerns)**
2. **의존성 역전 (Dependency Inversion)**
3. **단일 책임 원칙 (Single Responsibility Principle)**
4. **개방-폐쇄 원칙 (Open-Closed Principle)**

### 아키텍처 목표

- **유지보수성**: 코드 변경이 쉬워야 함
- **확장성**: 새로운 기능 추가가 용이해야 함
- **테스트 가능성**: 단위 테스트 작성이 쉬워야 함
- **독립성**: 각 계층이 독립적으로 동작해야 함

## 🏛 Layered Architecture

Handi 프로젝트는 4계층 아키텍처를 사용합니다:

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

### 1. Presentation Layer (프레젠테이션 계층)

**책임**: 사용자 인터페이스와 사용자 상호작용

**구성 요소**:
- React 컴포넌트
- 상태 관리 (Zustand)
- 라우팅
- UI 로직

**위치**: `app/presentation/`

```typescript
// 예시: 페이지 컴포넌트
export const PatientsPage = () => {
  const { data, isLoading } = usePatients()
  
  if (isLoading) return <LoadingSpinner />
  
  return (
    <div>
      {data?.patients.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  )
}
```

### 2. Application Layer (애플리케이션 계층)

**책임**: 비즈니스 로직 조정, 유스케이스 구현

**구성 요소**:
- 서비스 클래스
- 커스텀 훅
- 매퍼 (DTO-Entity 변환)
- 비즈니스 로직

**위치**: `app/application/`

```typescript
// 예시: 서비스 클래스
export class PatientService {
  async getPatients(page: number, limit: number) {
    const response = await patientApi.getPatients(page, limit)
    return {
      patients: PatientMapper.toEntityList(response.data),
      total: response.total,
      page: response.page,
      totalPages: response.totalPages
    }
  }
}

// 예시: 커스텀 훅
export const usePatients = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: () => patientService.getPatients(page, limit)
  })
}
```

### 3. Domain Layer (도메인 계층)

**책임**: 핵심 비즈니스 로직, 도메인 규칙

**구성 요소**:
- 엔티티 (도메인 객체)
- 값 객체 (Value Objects)
- 도메인 서비스
- 도메인 이벤트

**위치**: `app/domain/`

```typescript
// 예시: 엔티티
export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phoneNumber: string
  address: string
  createdAt: Date
  updatedAt: Date
}

// 예시: 도메인 서비스
export class PatientDomainService {
  static isEligibleForConsultation(patient: Patient): boolean {
    return patient.age >= 18
  }
  
  static calculateRiskScore(patient: Patient): number {
    // 복잡한 비즈니스 로직
    return 0
  }
}
```

### 4. Infrastructure Layer (인프라 계층)

**책임**: 외부 시스템과의 통신, 데이터 접근

**구성 요소**:
- API 클라이언트
- DTO (Data Transfer Objects)
- 외부 서비스 어댑터
- 데이터베이스 접근

**위치**: `app/infrastructure/`

```typescript
// 예시: API 클라이언트
export const patientApi = {
  async getPatients(page: number, limit: number): Promise<PaginatedResponseDto<PatientResponseDto>> {
    const response = await httpClient.get('/patients', {
      params: { page, limit }
    })
    return response.data
  }
}

// 예시: DTO
export interface PatientResponseDto {
  id: string
  name: string
  age: number
  gender: string
  phone_number: string
  address: string
  created_at: string
  updated_at: string
}
```

## 🎯 Domain-Driven Design

### 엔티티 (Entity)

도메인의 핵심 개념을 나타내는 객체입니다.

```typescript
// app/domain/entities/Patient.ts
export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phoneNumber: string
  address: string
  createdAt: Date
  updatedAt: Date
}

// 도메인 로직
export const PatientDomainService = {
  isEligibleForConsultation(patient: Patient): boolean {
    return patient.age >= 18
  },
  
  getAgeGroup(patient: Patient): string {
    if (patient.age < 20) return '청소년'
    if (patient.age < 65) return '성인'
    return '노인'
  }
}
```

### 값 객체 (Value Object)

불변하고 식별자가 없는 객체입니다.

```typescript
// app/domain/entities/HealthRecord.ts
export interface HealthRecord {
  id: string
  patientId: string
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  bloodSugar: number
  temperature: number
  recordedAt: Date
  recordedBy: string
}

// 값 객체 예시
export interface BloodPressure {
  systolic: number
  diastolic: number
}

export const BloodPressureService = {
  isNormal(bp: BloodPressure): boolean {
    return bp.systolic < 140 && bp.diastolic < 90
  },
  
  getCategory(bp: BloodPressure): string {
    if (bp.systolic < 120 && bp.diastolic < 80) return '정상'
    if (bp.systolic < 130 && bp.diastolic < 85) return '정상-높음'
    if (bp.systolic < 140 && bp.diastolic < 90) return '고혈압 전단계'
    return '고혈압'
  }
}
```

## 🔄 DTO-Entity Pattern

### DTO (Data Transfer Object)

API 통신을 위한 데이터 구조입니다.

```typescript
// app/infrastructure/dto/PatientDto.ts
export interface PatientResponseDto {
  id: string
  name: string
  age: number
  gender: string
  phone_number: string
  address: string
  created_at: string
  updated_at: string
}

export interface CreatePatientRequestDto {
  name: string
  age: number
  gender: string
  phone_number: string
  address: string
}
```

### Mapper

DTO와 Entity 간의 변환을 담당합니다.

```typescript
// app/application/mappers/PatientMapper.ts
export class PatientMapper {
  static toEntity(dto: PatientResponseDto): Patient {
    return {
      id: dto.id,
      name: dto.name,
      age: dto.age,
      gender: dto.gender as 'male' | 'female',
      phoneNumber: dto.phone_number,
      address: dto.address,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at)
    }
  }
  
  static toDto(entity: Patient): PatientResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      age: entity.age,
      gender: entity.gender,
      phone_number: entity.phoneNumber,
      address: entity.address,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString()
    }
  }
  
  static toEntityList(dtos: PatientResponseDto[]): Patient[] {
    return dtos.map(dto => this.toEntity(dto))
  }
}
```

## 🔗 의존성 관리

### 의존성 방향

```
Presentation → Application → Domain ← Infrastructure
```

- **Presentation Layer**: Application Layer에만 의존
- **Application Layer**: Domain Layer에만 의존
- **Domain Layer**: 다른 계층에 의존하지 않음
- **Infrastructure Layer**: Domain Layer에만 의존

### 의존성 주입

```typescript
// app/application/services/PatientService.ts
export class PatientService {
  constructor(
    private patientApi: typeof patientApi,
    private patientMapper: typeof PatientMapper
  ) {}
  
  async getPatients(page: number, limit: number) {
    const response = await this.patientApi.getPatients(page, limit)
    return {
      patients: this.patientMapper.toEntityList(response.data),
      total: response.total,
      page: response.page,
      totalPages: response.totalPages
    }
  }
}
```

### 인터페이스 분리

```typescript
// app/domain/repositories/IPatientRepository.ts
export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>
  findAll(page: number, limit: number): Promise<{ patients: Patient[], total: number }>
  save(patient: Patient): Promise<Patient>
  delete(id: string): Promise<void>
}

// app/infrastructure/repositories/PatientRepository.ts
export class PatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    const response = await patientApi.getPatient(id)
    return PatientMapper.toEntity(response.data)
  }
  
  // ... 다른 메서드들
}
```

## 📝 실제 구현 예시

### 전체 플로우 예시

```typescript
// 1. Presentation Layer
export const PatientsPage = () => {
  const { data, isLoading } = usePatients(1, 20)
  
  return (
    <div>
      {data?.patients.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  )
}

// 2. Application Layer - Hook
export const usePatients = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: () => patientService.getPatients(page, limit)
  })
}

// 3. Application Layer - Service
export class PatientService {
  async getPatients(page: number, limit: number) {
    const response = await patientApi.getPatients(page, limit)
    return {
      patients: PatientMapper.toEntityList(response.data),
      total: response.total,
      page: response.page,
      totalPages: response.totalPages
    }
  }
}

// 4. Infrastructure Layer - API
export const patientApi = {
  async getPatients(page: number, limit: number) {
    const response = await httpClient.get('/patients', {
      params: { page, limit }
    })
    return response.data
  }
}

// 5. Infrastructure Layer - DTO
export interface PatientResponseDto {
  id: string
  name: string
  age: number
  gender: string
  phone_number: string
  address: string
  created_at: string
  updated_at: string
}

// 6. Application Layer - Mapper
export class PatientMapper {
  static toEntity(dto: PatientResponseDto): Patient {
    return {
      id: dto.id,
      name: dto.name,
      age: dto.age,
      gender: dto.gender as 'male' | 'female',
      phoneNumber: dto.phone_number,
      address: dto.address,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at)
    }
  }
}

// 7. Domain Layer - Entity
export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phoneNumber: string
  address: string
  createdAt: Date
  updatedAt: Date
}
```

## 🧪 테스트 전략

### 계층별 테스트

```typescript
// Domain Layer 테스트
describe('PatientDomainService', () => {
  it('should determine if patient is eligible for consultation', () => {
    const patient: Patient = {
      id: '1',
      name: '홍길동',
      age: 25,
      gender: 'male',
      phoneNumber: '010-1234-5678',
      address: '서울시 강남구',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    expect(PatientDomainService.isEligibleForConsultation(patient)).toBe(true)
  })
})

// Application Layer 테스트
describe('PatientService', () => {
  it('should get patients with pagination', async () => {
    const mockResponse = {
      data: [mockPatientDto],
      total: 1,
      page: 1,
      totalPages: 1
    }
    
    jest.spyOn(patientApi, 'getPatients').mockResolvedValue(mockResponse)
    
    const result = await patientService.getPatients(1, 10)
    
    expect(result.patients).toHaveLength(1)
    expect(result.total).toBe(1)
  })
})

// Presentation Layer 테스트
describe('PatientsPage', () => {
  it('should render patient cards', () => {
    render(<PatientsPage />)
    
    expect(screen.getByText('환자 목록')).toBeInTheDocument()
  })
})
```

## 📚 모범 사례

### 1. 계층 간 의존성 관리

```typescript
// ❌ 잘못된 예시 - Presentation에서 Infrastructure 직접 사용
const PatientsPage = () => {
  const [patients, setPatients] = useState([])
  
  useEffect(() => {
    patientApi.getPatients().then(response => {
      setPatients(response.data)
    })
  }, [])
}

// ✅ 올바른 예시 - Application Layer를 통한 접근
const PatientsPage = () => {
  const { data: patients } = usePatients()
}
```

### 2. 도메인 로직 분리

```typescript
// ❌ 잘못된 예시 - 컴포넌트에 비즈니스 로직
const PatientCard = ({ patient }) => {
  const isEligible = patient.age >= 18
  
  return (
    <div className={isEligible ? 'eligible' : 'not-eligible'}>
      {patient.name}
    </div>
  )
}

// ✅ 올바른 예시 - 도메인 서비스 사용
const PatientCard = ({ patient }) => {
  const isEligible = PatientDomainService.isEligibleForConsultation(patient)
  
  return (
    <div className={isEligible ? 'eligible' : 'not-eligible'}>
      {patient.name}
    </div>
  )
}
```

### 3. 에러 처리

```typescript
// Application Layer에서 에러 처리
export class PatientService {
  async getPatients(page: number, limit: number) {
    try {
      const response = await patientApi.getPatients(page, limit)
      return {
        patients: PatientMapper.toEntityList(response.data),
        total: response.total,
        page: response.page,
        totalPages: response.totalPages
      }
    } catch (error) {
      // 도메인 에러로 변환
      throw new PatientNotFoundError('환자 정보를 찾을 수 없습니다.')
    }
  }
}
```

## 🔧 개발 도구

### TypeScript 설정

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint 규칙

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

## 📚 추가 리소스

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://domainlanguage.com/ddd/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Architecture Patterns](https://react.dev/learn/thinking-in-react)

## 🤝 기여 가이드

새로운 기능을 추가할 때:

1. **계층별 분리**: 각 계층의 책임을 명확히 구분
2. **도메인 중심 설계**: 비즈니스 로직을 도메인 계층에 배치
3. **타입 안전성**: TypeScript를 활용한 타입 정의
4. **테스트 작성**: 각 계층별로 적절한 테스트 작성
5. **문서화**: 아키텍처 결정사항 문서화

---

이 가이드를 따라 확장 가능하고 유지보수하기 쉬운 아키텍처를 구축해주세요! 