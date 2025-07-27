import type { 
  PatientResponseDto, 
  HealthRecordResponseDto, 
  ConsultationScheduleResponseDto 
} from '../../infrastructure/dto/PatientDto'

export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phoneNumber: string
  address: string
  nurseId: string
  createdAt: Date
  updatedAt: Date
  emergencyContact?: string
  medicalHistory?: string[]
  allergies?: string[]
}

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
  notes?: string
  recordedBy: string
}

export interface ConsultationSchedule {
  id: string
  nurseId: string
  date: Date
  timeSlot: string
  isAvailable: boolean
  patientId?: string
  patientName?: string
  consultationType?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
} 