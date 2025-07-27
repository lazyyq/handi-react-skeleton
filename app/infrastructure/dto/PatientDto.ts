// API 응답용 Patient DTO
export interface PatientResponseDto {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phone_number: string
  address: string
  nurse_id: string
  created_at: string
  updated_at: string
  emergency_contact?: string
  medical_history?: string[]
  allergies?: string[]
}

// 환자 생성 요청 DTO
export interface CreatePatientRequestDto {
  name: string
  age: number
  gender: 'male' | 'female'
  phone_number: string
  address: string
  nurse_id: string
  emergency_contact?: string
  medical_history?: string[]
  allergies?: string[]
}

// 환자 업데이트 요청 DTO
export interface UpdatePatientRequestDto {
  name?: string
  age?: number
  phone_number?: string
  address?: string
  nurse_id?: string
  emergency_contact?: string
  medical_history?: string[]
  allergies?: string[]
}

// 건강 기록 DTO
export interface HealthRecordResponseDto {
  id: string
  patient_id: string
  blood_pressure_systolic: number
  blood_pressure_diastolic: number
  blood_sugar: number
  temperature: number
  recorded_at: string
  notes?: string
  recorded_by: string
}

// 건강 기록 생성 요청 DTO
export interface CreateHealthRecordRequestDto {
  patient_id: string
  blood_pressure_systolic: number
  blood_pressure_diastolic: number
  blood_sugar: number
  temperature: number
  notes?: string
}

// 상담 일정 DTO
export interface ConsultationScheduleResponseDto {
  id: string
  nurse_id: string
  date: string
  time_slot: string
  is_available: boolean
  patient_id?: string
  patient_name?: string
  consultation_type?: string
  notes?: string
  created_at: string
  updated_at: string
}

// 상담 일정 생성 요청 DTO
export interface CreateConsultationScheduleRequestDto {
  nurse_id: string
  date: string
  time_slot: string
  is_available: boolean
  patient_id?: string
  consultation_type?: string
  notes?: string
}

// 페이지네이션 응답 DTO
export interface PaginatedResponseDto<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
} 