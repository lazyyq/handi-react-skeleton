import { httpClient } from '../../../../shared/infrastructure/api/httpClient'
import type { 
  PatientResponseDto,
  CreatePatientRequestDto,
  UpdatePatientRequestDto,
  HealthRecordResponseDto,
  CreateHealthRecordRequestDto,
  ConsultationScheduleResponseDto,
  CreateConsultationScheduleRequestDto,
  PaginatedResponseDto
} from '../dto/PatientDto'

/**
 * 환자 관련 API 호출 함수들
 */
export const patientApi = {
  /**
   * 환자 목록 조회 API
   * GET /patients
   */
  async getPatients(params?: {
    nurse_id?: string
    page?: number
    limit?: number
    search?: string
    gender?: 'male' | 'female'
    age_min?: number
    age_max?: number
  }): Promise<PaginatedResponseDto<PatientResponseDto>> {
    const response = await httpClient.get<PaginatedResponseDto<PatientResponseDto>>('/patients', { params })
    return response.data
  },

  /**
   * 특정 환자 조회 API
   * GET /patients/:id
   */
  async getPatient(patientId: string): Promise<PatientResponseDto> {
    const response = await httpClient.get<PatientResponseDto>(`/patients/${patientId}`)
    return response.data
  },

  /**
   * 환자 생성 API
   * POST /patients
   */
  async createPatient(patientData: CreatePatientRequestDto): Promise<PatientResponseDto> {
    const response = await httpClient.post<PatientResponseDto>('/patients', patientData)
    return response.data
  },

  /**
   * 환자 정보 업데이트 API
   * PUT /patients/:id
   */
  async updatePatient(patientId: string, patientData: UpdatePatientRequestDto): Promise<PatientResponseDto> {
    const response = await httpClient.put<PatientResponseDto>(`/patients/${patientId}`, patientData)
    return response.data
  },

  /**
   * 환자 삭제 API
   * DELETE /patients/:id
   */
  async deletePatient(patientId: string): Promise<void> {
    await httpClient.delete(`/patients/${patientId}`)
  },

  /**
   * 환자 검색 API
   * GET /patients/search
   */
  async searchPatients(params: {
    q: string
    nurse_id?: string
    limit?: number
  }): Promise<PatientResponseDto[]> {
    const response = await httpClient.get<PatientResponseDto[]>('/patients/search', { params })
    return response.data
  },

  /**
   * 환자 통계 조회 API
   * GET /patients/stats
   */
  async getPatientStats(params?: {
    nurse_id?: string
    period?: 'week' | 'month' | 'year'
  }): Promise<{
    total_patients: number
    new_patients_this_month: number
    average_age: number
    gender_distribution: { male: number; female: number }
    age_distribution: Array<{ age_group: string; count: number }>
    health_status_summary: {
      good: number
      fair: number
      poor: number
    }
  }> {
    const response = await httpClient.get('/patients/stats', { params })
    return response.data
  }
}

/**
 * 건강 기록 관련 API 호출 함수들
 */
export const healthRecordApi = {
  /**
   * 환자의 건강 기록 목록 조회 API
   * GET /patients/:id/health-records
   */
  async getHealthRecords(patientId: string, params?: {
    limit?: number
    offset?: number
    from_date?: string
    to_date?: string
    sort?: 'asc' | 'desc'
  }): Promise<HealthRecordResponseDto[]> {
    const response = await httpClient.get<HealthRecordResponseDto[]>(
      `/patients/${patientId}/health-records`, 
      { params }
    )
    return response.data
  },

  /**
   * 건강 기록 추가 API
   * POST /patients/:id/health-records
   */
  async addHealthRecord(patientId: string, recordData: CreateHealthRecordRequestDto): Promise<HealthRecordResponseDto> {
    const response = await httpClient.post<HealthRecordResponseDto>(
      `/patients/${patientId}/health-records`,
      recordData
    )
    return response.data
  },

  /**
   * 건강 기록 수정 API
   * PUT /health-records/:id
   */
  async updateHealthRecord(recordId: string, recordData: Partial<CreateHealthRecordRequestDto>): Promise<HealthRecordResponseDto> {
    const response = await httpClient.put<HealthRecordResponseDto>(`/health-records/${recordId}`, recordData)
    return response.data
  },

  /**
   * 건강 기록 삭제 API
   * DELETE /health-records/:id
   */
  async deleteHealthRecord(recordId: string): Promise<void> {
    await httpClient.delete(`/health-records/${recordId}`)
  },

  /**
   * 건강 기록 통계 조회 API
   * GET /patients/:id/health-records/stats
   */
  async getHealthRecordStats(patientId: string, params?: {
    period?: 'week' | 'month' | 'year'
    metrics?: string[]
  }): Promise<{
    blood_pressure: {
      average_systolic: number
      average_diastolic: number
      trend: 'improving' | 'stable' | 'worsening'
    }
    blood_sugar: {
      average: number
      trend: 'improving' | 'stable' | 'worsening'
    }
    temperature: {
      average: number
      trend: 'normal' | 'elevated'
    }
    record_count: number
    latest_record_date: string
  }> {
    const response = await httpClient.get(`/patients/${patientId}/health-records/stats`, { params })
    return response.data
  }
}

/**
 * 상담 일정 관련 API 호출 함수들
 */
export const consultationApi = {
  /**
   * 상담 일정 목록 조회 API
   * GET /consultations
   */
  async getConsultations(params?: {
    nurse_id?: string
    patient_id?: string
    date?: string
    is_available?: boolean
    page?: number
    limit?: number
  }): Promise<PaginatedResponseDto<ConsultationScheduleResponseDto>> {
    const response = await httpClient.get<PaginatedResponseDto<ConsultationScheduleResponseDto>>('/consultations', { params })
    return response.data
  },

  /**
   * 상담 일정 생성 API
   * POST /consultations
   */
  async createConsultation(consultationData: CreateConsultationScheduleRequestDto): Promise<ConsultationScheduleResponseDto> {
    const response = await httpClient.post<ConsultationScheduleResponseDto>('/consultations', consultationData)
    return response.data
  },

  /**
   * 상담 일정 수정 API
   * PUT /consultations/:id
   */
  async updateConsultation(consultationId: string, consultationData: Partial<CreateConsultationScheduleRequestDto>): Promise<ConsultationScheduleResponseDto> {
    const response = await httpClient.put<ConsultationScheduleResponseDto>(`/consultations/${consultationId}`, consultationData)
    return response.data
  },

  /**
   * 상담 일정 삭제 API
   * DELETE /consultations/:id
   */
  async deleteConsultation(consultationId: string): Promise<void> {
    await httpClient.delete(`/consultations/${consultationId}`)
  },

  /**
   * 상담 예약 API
   * POST /consultations/:id/book
   */
  async bookConsultation(consultationId: string, bookingData: {
    patient_id: string
    consultation_type?: string
    notes?: string
  }): Promise<ConsultationScheduleResponseDto> {
    const response = await httpClient.post<ConsultationScheduleResponseDto>(
      `/consultations/${consultationId}/book`,
      bookingData
    )
    return response.data
  },

  /**
   * 상담 예약 취소 API
   * POST /consultations/:id/cancel
   */
  async cancelConsultation(consultationId: string): Promise<ConsultationScheduleResponseDto> {
    const response = await httpClient.post<ConsultationScheduleResponseDto>(`/consultations/${consultationId}/cancel`)
    return response.data
  },

  /**
   * 간호사의 가용 시간 조회 API
   * GET /consultations/available-slots
   */
  async getAvailableSlots(params: {
    nurse_id: string
    date: string
  }): Promise<Array<{
    time_slot: string
    is_available: boolean
    consultation_id?: string
  }>> {
    const response = await httpClient.get('/consultations/available-slots', { params })
    return response.data
  }
}

/**
 * API 응답 예시:
 * 
 * Patient Response:
 * {
 *   "id": "patient-123",
 *   "name": "김환자",
 *   "age": 65,
 *   "gender": "male",
 *   "phone_number": "010-1234-5678",
 *   "address": "서울시 강남구",
 *   "nurse_id": "nurse-456",
 *   "created_at": "2024-01-15T00:00:00Z",
 *   "updated_at": "2024-01-20T00:00:00Z",
 *   "emergency_contact": "010-1234-9999",
 *   "medical_history": ["고혈압", "당뇨"],
 *   "allergies": ["페니실린"]
 * }
 * 
 * Health Record Response:
 * {
 *   "id": "record-789",
 *   "patient_id": "patient-123",
 *   "blood_pressure_systolic": 130,
 *   "blood_pressure_diastolic": 85,
 *   "blood_sugar": 120,
 *   "temperature": 36.5,
 *   "recorded_at": "2024-01-20T09:00:00Z",
 *   "recorded_by": "nurse-456",
 *   "notes": "정상 범위"
 * }
 * 
 * Consultation Schedule Response:
 * {
 *   "id": "consultation-101",
 *   "nurse_id": "nurse-456",
 *   "date": "2024-01-25",
 *   "time_slot": "10:00-10:30",
 *   "is_available": false,
 *   "patient_id": "patient-123",
 *   "patient_name": "김환자",
 *   "consultation_type": "정기 상담",
 *   "notes": "혈압 관리 상담",
 *   "created_at": "2024-01-20T00:00:00Z",
 *   "updated_at": "2024-01-20T00:00:00Z"
 * }
 */ 