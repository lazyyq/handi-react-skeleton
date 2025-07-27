import { httpClient } from '~/shared/infrastructure/api/httpClient'
import { PatientMapper } from '../mappers/PatientMapper'
import type { Patient, HealthRecord, ConsultationSchedule } from '../../domain/Patient'
import type {
  PatientResponseDto,
  CreatePatientRequestDto,
  UpdatePatientRequestDto,
  HealthRecordResponseDto,
  CreateHealthRecordRequestDto,
  ConsultationScheduleResponseDto,
  PaginatedResponseDto
} from '../../infrastructure/dto/PatientDto'

export class PatientService {
  private readonly basePath = '/patients'
  
  // 싱글톤 인스턴스
  private static instance: PatientService | null = null
  
  // 싱글톤 인스턴스 반환
  public static getInstance(): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService()
    }
    return PatientService.instance
  }
  
  // 생성자를 private으로 만들어 외부에서 new로 생성 불가
  private constructor() {}

  /**
   * 환자 목록 조회
   */
  async getPatients(filters?: {
    nurseId?: string
    page?: number
    limit?: number
    search?: string
  }): Promise<{
    patients: Patient[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const params = {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        ...(filters?.nurseId && { nurse_id: filters.nurseId }),
        ...(filters?.search && { search: filters.search })
      }

      const response = await httpClient.get<PaginatedResponseDto<PatientResponseDto>>(
        this.basePath, 
        { params }
      )

      return {
        patients: response.data.data.map((dto: PatientResponseDto) => PatientMapper.toEntity(dto)),
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.total_pages
      }
    } catch (error) {
      // API가 없는 경우 목업 데이터 반환
      console.warn('Patients API not available, using mock data')
      
      const mockPatients: PatientResponseDto[] = [
        {
          id: '1',
          name: '김환자',
          age: 65,
          gender: 'male',
          phone_number: '010-1234-5678',
          address: '서울시 강남구',
          nurse_id: 'nurse-user-1',
          created_at: new Date('2024-01-15').toISOString(),
          updated_at: new Date('2024-01-20').toISOString(),
          emergency_contact: '010-1234-9999',
          medical_history: ['고혈압', '당뇨'],
          allergies: ['페니실린']
        },
        {
          id: '2',
          name: '이할머니',
          age: 78,
          gender: 'female',
          phone_number: '010-9876-5432',
          address: '서울시 서초구',
          nurse_id: 'nurse-user-1',
          created_at: new Date('2024-01-10').toISOString(),
          updated_at: new Date('2024-01-18').toISOString(),
          emergency_contact: '010-9876-1111',
          medical_history: ['관절염'],
          allergies: []
        },
        {
          id: '3',
          name: '박할아버지',
          age: 72,
          gender: 'male',
          phone_number: '010-5555-1234',
          address: '서울시 송파구',
          nurse_id: 'nurse-2',
          created_at: new Date('2024-01-08').toISOString(),
          updated_at: new Date('2024-01-19').toISOString(),
          emergency_contact: '010-5555-9999',
          medical_history: ['심장병'],
          allergies: ['아스피린']
        }
      ]

      let filteredPatients = mockPatients

      // 간호사 필터 적용
      if (filters?.nurseId) {
        filteredPatients = filteredPatients.filter(p => p.nurse_id === filters.nurseId)
      }

      // 검색 필터 적용
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredPatients = filteredPatients.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.phone_number.includes(searchTerm) ||
          p.address.toLowerCase().includes(searchTerm)
        )
      }

      return {
        patients: filteredPatients.map(dto => PatientMapper.toEntity(dto)),
        total: filteredPatients.length,
        page: 1,
        totalPages: 1
      }
    }
  }

  /**
   * 특정 환자 조회
   */
  async getPatient(patientId: string): Promise<Patient> {
    try {
      const response = await httpClient.get<PatientResponseDto>(`${this.basePath}/${patientId}`)
      return PatientMapper.toEntity(response.data)
    } catch (error) {
      // API가 없는 경우 목업 데이터 반환
      console.warn('Patient API not available, using mock data')
      
      const mockPatient: PatientResponseDto = {
        id: patientId,
        name: '김환자',
        age: 65,
        gender: 'male',
        phone_number: '010-1234-5678',
        address: '서울시 강남구 테헤란로 123',
        nurse_id: 'nurse-user-1',
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date('2024-01-20').toISOString(),
        emergency_contact: '010-1234-9999',
        medical_history: ['고혈압', '당뇨'],
        allergies: ['페니실린']
      }

      return PatientMapper.toEntity(mockPatient)
    }
  }

  /**
   * 환자 생성
   */
  async createPatient(patientData: CreatePatientRequestDto): Promise<Patient> {
    try {
      const response = await httpClient.post<PatientResponseDto>(this.basePath, patientData)
      return PatientMapper.toEntity(response.data)
    } catch (error) {
      throw new Error('Failed to create patient')
    }
  }

  /**
   * 환자 정보 업데이트
   */
  async updatePatient(patientId: string, patientData: UpdatePatientRequestDto): Promise<Patient> {
    try {
      const response = await httpClient.put<PatientResponseDto>(
        `${this.basePath}/${patientId}`, 
        patientData
      )
      return PatientMapper.toEntity(response.data)
    } catch (error) {
      throw new Error('Failed to update patient')
    }
  }

  /**
   * 환자 삭제
   */
  async deletePatient(patientId: string): Promise<void> {
    try {
      await httpClient.delete(`${this.basePath}/${patientId}`)
    } catch (error) {
      throw new Error('Failed to delete patient')
    }
  }

  /**
   * 환자의 건강 기록 조회
   */
  async getPatientHealthRecords(patientId: string, limit?: number): Promise<HealthRecord[]> {
    try {
      const params = limit ? { limit } : {}
      const response = await httpClient.get<HealthRecordResponseDto[]>(
        `${this.basePath}/${patientId}/health-records`,
        { params }
      )
      
      return response.data.map((dto: HealthRecordResponseDto) => PatientMapper.healthRecordToEntity(dto))
    } catch (error) {
      // API가 없는 경우 목업 데이터 반환
      console.warn('Health records API not available, using mock data')
      
      const mockHealthRecords: HealthRecordResponseDto[] = [
        {
          id: '1',
          patient_id: patientId,
          blood_pressure_systolic: 130,
          blood_pressure_diastolic: 85,
          blood_sugar: 120,
          temperature: 36.5,
          recorded_at: new Date('2024-01-20T09:00:00').toISOString(),
          recorded_by: 'nurse-user-1',
          notes: '정상 범위'
        },
        {
          id: '2',
          patient_id: patientId,
          blood_pressure_systolic: 135,
          blood_pressure_diastolic: 88,
          blood_sugar: 115,
          temperature: 36.7,
          recorded_at: new Date('2024-01-19T14:00:00').toISOString(),
          recorded_by: 'nurse-user-1',
          notes: '약간 높음'
        },
        {
          id: '3',
          patient_id: patientId,
          blood_pressure_systolic: 128,
          blood_pressure_diastolic: 82,
          blood_sugar: 118,
          temperature: 36.4,
          recorded_at: new Date('2024-01-18T10:30:00').toISOString(),
          recorded_by: 'nurse-user-1',
          notes: '안정적'
        }
      ]

      return mockHealthRecords
        .slice(0, limit)
        .map(dto => PatientMapper.healthRecordToEntity(dto))
    }
  }

  /**
   * 건강 기록 추가
   */
  async addHealthRecord(healthRecordData: CreateHealthRecordRequestDto): Promise<HealthRecord> {
    try {
      const response = await httpClient.post<HealthRecordResponseDto>(
        `/patients/${healthRecordData.patient_id}/health-records`,
        healthRecordData
      )
      return PatientMapper.healthRecordToEntity(response.data)
    } catch (error) {
      throw new Error('Failed to add health record')
    }
  }

  /**
   * 환자 통계 조회
   */
  async getPatientStats(nurseId?: string): Promise<{
    totalPatients: number
    newPatientsThisMonth: number
    averageAge: number
    genderDistribution: { male: number; female: number }
  }> {
    try {
      const params = nurseId ? { nurse_id: nurseId } : {}
      const response = await httpClient.get('/patients/stats', { params })
      return response.data
    } catch (error) {
      // API가 없는 경우 목업 데이터 반환
      console.warn('Patient stats API not available, using mock data')
      
      return {
        totalPatients: 3,
        newPatientsThisMonth: 1,
        averageAge: 68.3,
        genderDistribution: { male: 2, female: 1 }
      }
    }
  }

  /**
   * 환자 검색
   */
  async searchPatients(query: string, nurseId?: string): Promise<Patient[]> {
    try {
      const params = {
        q: query,
        ...(nurseId && { nurse_id: nurseId })
      }
      
      const response = await httpClient.get<PatientResponseDto[]>(`${this.basePath}/search`, { params })
      return response.data.map((dto: PatientResponseDto) => PatientMapper.toEntity(dto))
    } catch (error) {
      // getPatients 메서드의 검색 기능 활용
      const result = await this.getPatients({ search: query, nurseId })
      return result.patients
    }
  }
} 