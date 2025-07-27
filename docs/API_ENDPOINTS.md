# Handi API 엔드포인트 문서

이 문서는 Handi 환자 관리 서비스의 REST API 엔드포인트를 설명합니다.

## 기본 정보

- **Base URL**: `https://api.handi.com` (Production), `http://localhost:3001/api` (Development)
- **인증 방식**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## 인증 (Authentication)

### 로그인
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "nurse@example.com",
  "password": "password123",
  "role": "nurse" // "nurse" | "admin"
}
```

**Response:**
```json
{
  "user": {
    "id": "nurse-123",
    "name": "김간호사",
    "email": "nurse@example.com",
    "role": "nurse",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-20T00:00:00Z",
    "department": "간호부",
    "phone_number": "010-1234-5678"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### 로그아웃
```http
POST /auth/logout
Authorization: Bearer {access_token}
```

### 토큰 갱신
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 현재 사용자 정보
```http
GET /auth/me
Authorization: Bearer {access_token}
```

## 사용자 관리 (Users)

### 사용자 목록 조회
```http
GET /users?role=nurse&page=1&limit=10&search=김
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `role` (optional): "nurse" | "admin"
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지 크기 (기본값: 10)
- `search` (optional): 검색어 (이름, 이메일)

**Response:**
```json
{
  "data": [
    {
      "id": "nurse-1",
      "name": "김간호사",
      "email": "nurse1@example.com",
      "role": "nurse",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-20T00:00:00Z",
      "department": "간호부"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```

### 사용자 생성 (관리자 전용)
```http
POST /users
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "새간호사",
  "email": "new.nurse@example.com",
  "password": "password123",
  "role": "nurse",
  "department": "간호부",
  "phone_number": "010-9999-8888"
}
```

### 사용자 정보 업데이트
```http
PUT /users/{userId}
Authorization: Bearer {access_token}
```

### 사용자 삭제 (관리자 전용)
```http
DELETE /users/{userId}
Authorization: Bearer {access_token}
```

### 비밀번호 변경
```http
POST /users/{userId}/change-password
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

## 환자 관리 (Patients)

### 환자 목록 조회
```http
GET /patients?nurse_id=nurse-123&page=1&limit=10&search=김&gender=male&age_min=60&age_max=80
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `nurse_id` (optional): 간호사 ID
- `page` (optional): 페이지 번호
- `limit` (optional): 페이지 크기
- `search` (optional): 검색어
- `gender` (optional): "male" | "female"
- `age_min`, `age_max` (optional): 나이 범위

**Response:**
```json
{
  "data": [
    {
      "id": "patient-123",
      "name": "김환자",
      "age": 65,
      "gender": "male",
      "phone_number": "010-1234-5678",
      "address": "서울시 강남구",
      "nurse_id": "nurse-456",
      "created_at": "2024-01-15T00:00:00Z",
      "updated_at": "2024-01-20T00:00:00Z",
      "emergency_contact": "010-1234-9999",
      "medical_history": ["고혈압", "당뇨"],
      "allergies": ["페니실린"]
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```

### 특정 환자 조회
```http
GET /patients/{patientId}
Authorization: Bearer {access_token}
```

### 환자 생성
```http
POST /patients
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "새환자",
  "age": 70,
  "gender": "female",
  "phone_number": "010-5555-6666",
  "address": "서울시 마포구",
  "nurse_id": "nurse-123",
  "emergency_contact": "010-5555-7777",
  "medical_history": ["관절염"],
  "allergies": []
}
```

### 환자 정보 업데이트
```http
PUT /patients/{patientId}
Authorization: Bearer {access_token}
```

### 환자 삭제
```http
DELETE /patients/{patientId}
Authorization: Bearer {access_token}
```

### 환자 검색
```http
GET /patients/search?q=김환자&nurse_id=nurse-123&limit=20
Authorization: Bearer {access_token}
```

### 환자 통계
```http
GET /patients/stats?nurse_id=nurse-123&period=month
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "total_patients": 15,
  "new_patients_this_month": 3,
  "average_age": 68.5,
  "gender_distribution": {
    "male": 8,
    "female": 7
  },
  "age_distribution": [
    { "age_group": "60-69", "count": 6 },
    { "age_group": "70-79", "count": 7 },
    { "age_group": "80+", "count": 2 }
  ],
  "health_status_summary": {
    "good": 10,
    "fair": 4,
    "poor": 1
  }
}
```

## 건강 기록 (Health Records)

### 환자의 건강 기록 조회
```http
GET /patients/{patientId}/health-records?limit=10&from_date=2024-01-01&to_date=2024-01-31&sort=desc
Authorization: Bearer {access_token}
```

**Response:**
```json
[
  {
    "id": "record-789",
    "patient_id": "patient-123",
    "blood_pressure_systolic": 130,
    "blood_pressure_diastolic": 85,
    "blood_sugar": 120,
    "temperature": 36.5,
    "recorded_at": "2024-01-20T09:00:00Z",
    "recorded_by": "nurse-456",
    "notes": "정상 범위"
  }
]
```

### 건강 기록 추가
```http
POST /patients/{patientId}/health-records
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "patient_id": "patient-123",
  "blood_pressure_systolic": 135,
  "blood_pressure_diastolic": 88,
  "blood_sugar": 125,
  "temperature": 36.7,
  "notes": "약간 높음"
}
```

### 건강 기록 수정
```http
PUT /health-records/{recordId}
Authorization: Bearer {access_token}
```

### 건강 기록 삭제
```http
DELETE /health-records/{recordId}
Authorization: Bearer {access_token}
```

### 건강 기록 통계
```http
GET /patients/{patientId}/health-records/stats?period=month
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "blood_pressure": {
    "average_systolic": 132.5,
    "average_diastolic": 86.2,
    "trend": "stable"
  },
  "blood_sugar": {
    "average": 118.7,
    "trend": "improving"
  },
  "temperature": {
    "average": 36.6,
    "trend": "normal"
  },
  "record_count": 15,
  "latest_record_date": "2024-01-20T09:00:00Z"
}
```

## 상담 일정 (Consultations)

### 상담 일정 목록 조회
```http
GET /consultations?nurse_id=nurse-123&date=2024-01-25&is_available=true&page=1&limit=20
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "data": [
    {
      "id": "consultation-101",
      "nurse_id": "nurse-456",
      "date": "2024-01-25",
      "time_slot": "10:00-10:30",
      "is_available": false,
      "patient_id": "patient-123",
      "patient_name": "김환자",
      "consultation_type": "정기 상담",
      "notes": "혈압 관리 상담",
      "created_at": "2024-01-20T00:00:00Z",
      "updated_at": "2024-01-20T00:00:00Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

### 상담 일정 생성
```http
POST /consultations
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "nurse_id": "nurse-123",
  "date": "2024-01-26",
  "time_slot": "14:00-14:30",
  "is_available": true,
  "consultation_type": "정기 상담",
  "notes": "혈압 체크"
}
```

### 상담 예약
```http
POST /consultations/{consultationId}/book
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "patient_id": "patient-123",
  "consultation_type": "정기 상담",
  "notes": "혈압 및 혈당 체크"
}
```

### 상담 예약 취소
```http
POST /consultations/{consultationId}/cancel
Authorization: Bearer {access_token}
```

### 가용 시간 슬롯 조회
```http
GET /consultations/available-slots?nurse_id=nurse-123&date=2024-01-25
Authorization: Bearer {access_token}
```

**Response:**
```json
[
  {
    "time_slot": "09:00-09:30",
    "is_available": true
  },
  {
    "time_slot": "10:00-10:30",
    "is_available": false,
    "consultation_id": "consultation-101"
  }
]
```

## 에러 응답

모든 API는 다음과 같은 형식의 에러 응답을 반환합니다:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "올바른 이메일 형식이 아닙니다."
      }
    ]
  }
}
```

## HTTP 상태 코드

- `200` - 성공
- `201` - 생성 성공
- `204` - 성공 (응답 본문 없음)
- `400` - 잘못된 요청
- `401` - 인증 실패
- `403` - 권한 없음
- `404` - 리소스를 찾을 수 없음
- `422` - 유효성 검증 실패
- `500` - 서버 내부 오류

## 인증 헤더

모든 보호된 엔드포인트는 다음 헤더가 필요합니다:

```
Authorization: Bearer {access_token}
```

## 페이지네이션

목록 조회 API는 다음과 같은 페이지네이션을 지원합니다:

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지 크기 (기본값: 10, 최대: 100)

**Response Format:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "total_pages": 10
}
``` 