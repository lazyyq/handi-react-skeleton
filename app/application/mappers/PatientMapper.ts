import type { Patient, HealthRecord, ConsultationSchedule } from '../../domain/entities/Patient'
import type { 
  PatientResponseDto, 
  HealthRecordResponseDto, 
  ConsultationScheduleResponseDto 
} from '../../infrastructure/dto/PatientDto'

/**
 * PatientMapper
 * 환자 관련 엔티티와 DTO 간의 데이터 변환을 담당
 */
export class PatientMapper {
  /**
   * PatientResponseDto를 Patient로 변환
   */
  static toEntity(dto: PatientResponseDto): Patient {
    return {
      id: dto.id,
      name: dto.name,
      age: dto.age,
      gender: dto.gender,
      phoneNumber: dto.phone_number,
      address: dto.address,
      nurseId: dto.nurse_id,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      emergencyContact: dto.emergency_contact,
      medicalHistory: dto.medical_history,
      allergies: dto.allergies
    }
  }

  /**
   * Patient를 PatientResponseDto로 변환
   */
  static toDto(entity: Patient): PatientResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      age: entity.age,
      gender: entity.gender,
      phone_number: entity.phoneNumber,
      address: entity.address,
      nurse_id: entity.nurseId,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
      emergency_contact: entity.emergencyContact,
      medical_history: entity.medicalHistory,
      allergies: entity.allergies
    }
  }

  /**
   * HealthRecordResponseDto를 HealthRecord로 변환
   */
  static healthRecordToEntity(dto: HealthRecordResponseDto): HealthRecord {
    return {
      id: dto.id,
      patientId: dto.patient_id,
      bloodPressure: {
        systolic: dto.blood_pressure_systolic,
        diastolic: dto.blood_pressure_diastolic
      },
      bloodSugar: dto.blood_sugar,
      temperature: dto.temperature,
      recordedAt: new Date(dto.recorded_at),
      recordedBy: dto.recorded_by,
      notes: dto.notes
    }
  }

  /**
   * HealthRecord를 HealthRecordResponseDto로 변환
   */
  static healthRecordToDto(entity: HealthRecord): HealthRecordResponseDto {
    return {
      id: entity.id,
      patient_id: entity.patientId,
      blood_pressure_systolic: entity.bloodPressure.systolic,
      blood_pressure_diastolic: entity.bloodPressure.diastolic,
      blood_sugar: entity.bloodSugar,
      temperature: entity.temperature,
      recorded_at: entity.recordedAt.toISOString(),
      recorded_by: entity.recordedBy,
      notes: entity.notes
    }
  }

  /**
   * ConsultationScheduleResponseDto를 ConsultationSchedule로 변환
   */
  static scheduleToEntity(dto: ConsultationScheduleResponseDto): ConsultationSchedule {
    return {
      id: dto.id,
      nurseId: dto.nurse_id,
      date: new Date(dto.date),
      timeSlot: dto.time_slot,
      isAvailable: dto.is_available,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      patientId: dto.patient_id,
      patientName: dto.patient_name,
      consultationType: dto.consultation_type,
      notes: dto.notes
    }
  }

  /**
   * ConsultationSchedule를 ConsultationScheduleResponseDto로 변환
   */
  static scheduleToDto(entity: ConsultationSchedule): ConsultationScheduleResponseDto {
    return {
      id: entity.id,
      nurse_id: entity.nurseId,
      date: entity.date.toISOString().split('T')[0], // YYYY-MM-DD
      time_slot: entity.timeSlot,
      is_available: entity.isAvailable,
      patient_id: entity.patientId,
      patient_name: entity.patientName,
      consultation_type: entity.consultationType,
      notes: entity.notes,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString()
    }
  }
} 